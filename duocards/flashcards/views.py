# IMPORT STATEMENTS -------------------------------------------------------------------------------------------------------


from django.http import HttpResponse
from django.db.models.query import QuerySet
from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse, reverse_lazy
from django.contrib import messages
from django.template.defaulttags import register
from django.utils.timezone import localdate
from django.forms import formset_factory

from django.views.generic import ListView, DetailView
from django.views.generic.base import TemplateView
from django.views.generic.edit import CreateView

from .models import *
from .forms import *
from model_utils.managers import InheritanceManager



# BASIC VIEWS ------------------------------------------------------------------------------------------------------------


class HomePage(ListView):
    model = Board
    template_name = 'flashcards/home.html'
    context_object_name = 'boards'

    def get_queryset(self):
        all_boards = super().get_queryset()
        due_boards = all_boards.filter(Q(genericitem__due_date__lte=localdate()) | 
                                     Q(genericitem__repeating_today=True)).distinct()
        return due_boards#.order_by('due_date', 'id')

    def get_first_card(self, queryset, category) -> dict[int, int]:
        #returns a dictionary of the first due card, either of the particular class or board
        dict = {}
        if category == 'class':
            #harcoding the values for the no class option
            all_cards = GenericItem.objects.filter(board__course__isnull=True)
            due_ids = GenericItem.get_due_card_ids(all_cards)
            dict[0] = GenericItem.get_first_id(due_ids)
        for item in queryset:
            if category == 'class':
                all_cards = GenericItem.objects.filter(board__course=item)
            elif category == 'board':
                all_cards = GenericItem.objects.filter(board=item)
            due_ids = GenericItem.get_due_card_ids(all_cards)
            dict[item.id] = GenericItem.get_first_id(due_ids)
        return dict
    
    def get_num_due(self, queryset, category) -> dict[int, int]:
        #returns a dictionary of the number of due cards, either of the particular class or board
        dict = {}
        due_cards = GenericItem.objects.filter(Q(due_date__lte=localdate()) | Q(repeating_today=True))
        for item in queryset:
            if category == 'class':
                dict[item.id] = len(due_cards.filter(board__course=item))
            elif category == 'board':
                dict[item.id] = len(due_cards.filter(board=item))
        return dict
    
    def cards_due(self, queryset) -> bool:
        return len(queryset) > 0

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        courses = Course.objects.filter(board__in=self.get_queryset()).distinct()
        due_ids = GenericItem.get_due_card_ids(GenericItem.objects.all())

        context |= {
            'user_name': 'Charlotte',
            'classes': courses,
            'first_due_id': GenericItem.get_first_id(due_ids),
            'class_first_ids': self.get_first_card(courses, 'class'),
            'board_first_ids': self.get_first_card(self.get_queryset(), 'board'),
            'num_due': len(due_ids),
            'class_num_due': self.get_num_due(courses, 'class'),
            'board_num_due': self.get_num_due(self.get_queryset(), 'board'),
            'cards_due': self.cards_due(self.get_queryset()),
            'due_in_no_class': self.cards_due(self.get_queryset().filter(course__isnull=True))
        }
        return context
    

class CourseView(ListView):
    model = Board
    template_name = 'flashcards/course_view.html'
    context_object_name = 'boards'

    def get_queryset(self):
        all_boards = super().get_queryset()
        slug = self.kwargs['course_slug']
        if slug == 'no-class':
            course_boards = all_boards.filter(course__isnull=True)
        else:
            course_boards = all_boards.filter(course__slug=slug)
        return course_boards

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        slug = self.kwargs['course_slug']
        if slug == 'no-class':
            course_cards = GenericItem.objects.filter(board__course__isnull=True)
            context |= {
                'course_name': 'Boards With No Class',
                'course_id': 0
            }
        else:
            course_cards = GenericItem.objects.filter(board__course__slug=slug)
            course = Course.objects.get(slug=slug)
            context |= {
                'course_name': course.name,
                'course_id': course.id
            }
        due_ids = GenericItem.get_due_card_ids(course_cards)
        all_ids = GenericItem.get_all_ids(course_cards)
        context |= {
            'course_slug': slug,
            'first_due_id': GenericItem.get_first_id(due_ids),
            'first_card_id': GenericItem.get_first_id(all_ids),
            'num_due': len(due_ids),
            'num_total': len(all_ids)
        }
        return context


class BoardView(TemplateView):
    template_name = 'flashcards/board_view.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        board = Board.objects.get(id=self.kwargs['board_id'])

        # get all board items and their ids (exlucing inactive table items)
        board_items = GenericItem.objects.filter(board=board).filter(
            models.Q(flashcarditem__isnull=False) |
            models.Q(tableitem__active=True)
        )
        due_ids = GenericItem.get_due_card_ids(board_items)
        all_ids = GenericItem.get_all_ids(board_items)

        context |= {
            'board': board,

            # flashcard items to show
            'flashcards': FlashcardItem.objects.filter(board=board),

            # table-related things to show
            'tables': Table.objects.filter(board=board),
            'headers': HeaderRowItem.objects.filter(table__board=board),
            'rows': TableRow.objects.filter(table__board=board),
            'table_items': TableItem.objects.filter(table_row__table__board=board, active=True),

            # card due information
            'first_due_id': GenericItem.get_first_id(due_ids),
            'first_card_id': GenericItem.get_first_id(all_ids),
            'num_due': len(due_ids),
            'num_total': len(all_ids),
        }
        return context


class StudyView(DetailView):
    model = GenericItem
    template_name = 'flashcards/study_cards.html'
    form_class = CorrectForm

    def get_next_id(self) -> int:
        #returns the id of the next card
        mode = self.kwargs['study_mode']
        category = self.kwargs['category']
        category_id = self.kwargs['category_id']

        try:
            #figure out the category of cards being studied
            if category == 'all':
                board_items = GenericItem.objects.all()
            elif category == 'class':
                if category_id == 0:
                    board_items = GenericItem.objects.filter(board__course__isnull=True)
                else:
                    board_items = GenericItem.objects.filter(board__course__id=category_id)
            elif category == 'board':
                board_items = GenericItem.objects.filter(board__id=category_id)
            #get the list of ids
            if mode == 'due':
                lo_ids = GenericItem.get_due_card_ids(board_items)
            elif mode == 'all':
                lo_ids = GenericItem.get_all_ids(board_items)
        except(NameError):
            lo_ids = []
        
        try:
            current_index = list(lo_ids).index(self.kwargs['pk'])
            next_id= lo_ids[current_index+1]
        except (ValueError, IndexError) as e:
            next_id = -1
        return next_id
    
    def get_context_data(self, **kwargs):
        #passes the additional context of the next id and the current study mode
        item = GenericItem.objects.get_subclass(id=self.kwargs['pk'])
        context = super().get_context_data(**kwargs)
        category = self.kwargs['category']
        cat_id = self.kwargs['category_id']
        if category == 'class':
            if cat_id == 0:
                context['class_slug'] = 'no-class'
            else:
                context['class_slug'] = Course.objects.get(id=cat_id).slug
        context |= {
            'item': item,
            'item_type': item.__class__.__name__,
            'next_id': self.get_next_id(),
            'study_mode': self.kwargs['study_mode'],
            'category': self.kwargs['category'],
            'category_id': self.kwargs['category_id'],
            'start': self.kwargs['start_loc']
        }
        return context

    def post(self, request, *args, **kwargs):
        #trigger spaced repetition algorithm
        form = self.form_class(request.POST)
        if form.is_valid():
            next_id = self.get_next_id()
            item = get_object_or_404(GenericItem, id=form.cleaned_data["card_id"])
            correct_or_not = form.cleaned_data.get('correct_or_not')
            item.calc_new_due_date(correct_or_not)
            
        #figure out where to redirect
        cat = self.kwargs['category']
        cat_id = self.kwargs['category_id']
        start = self.kwargs['start_loc']
        if next_id > 0:
            redrct = redirect('study', study_mode = self.kwargs['study_mode'], 
                        category = cat,
                        category_id = cat_id,
                        pk = next_id,
                        start_loc = start)
        elif start == 'home' or cat == 'all':
            redrct = redirect('home')
        elif cat == 'class':
            if cat_id == 0:
                slug = 'no-class'
            else:
                slug = Course.objects.get(id=cat_id).slug
            redrct = redirect('course-view', course_slug = slug)
        elif cat == 'board':
            redrct = redirect('board-view', board_id = cat_id)
        else:
            redrct = redirect('home')
        return redrct
    


# CREATE VIEWS -----------------------------------------------------------------------------------------------------------


class CreateCourse(CreateView):
    model = Course
    fields = ['name']

    def form_valid(self, form):
        messages.success(self.request, 'New class created successfully!')
        return super(CreateCourse, self).form_valid(form)

    def get_success_url(self) -> str:
        slug = self.object.slug
        return reverse_lazy('course-view', kwargs={'course_slug': slug})
    

class CreateBoard(CreateView):
    model = Board
    fields = ['name']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['course_slug'] = self.kwargs['course_slug']
        return context

    def form_valid(self, form):
        #automatically set course
        slug = self.kwargs['course_slug']
        if slug != 'no-class':
            form.instance.course = Course.objects.get(slug=slug)
        #success messages
        messages.success(self.request, 'New board created successfully!')
        return super(CreateBoard, self).form_valid(form)
    
    def get_success_url(self) -> str:
        board_id = self.object.id
        return reverse_lazy('board-view', kwargs={'board_id': board_id})


class CreateCard(CreateView):
    model = FlashcardItem
    fields = ['question', 'answer', 'due_date'] # remove due date from the form in the end

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['board_id'] = self.kwargs['board_id']
        return context

    def get_success_url(self) -> str:
        board_id = self.kwargs['board_id']
        return reverse_lazy('create-card', kwargs={'board_id': board_id})

    def form_valid(self, form):
        # automatically set board
        form.instance.board = Board.objects.get(id=self.kwargs['board_id'])
        # success messages 
        messages.success(self.request, 'New card created successfully!')
        return super(CreateCard, self).form_valid(form)


class CreateTable(CreateView):
    model = Table
    fields = ['name']

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['board_id'] = self.kwargs['board_id']
        return context

    def form_valid(self, form):
        # automatically set board
        form.instance.board = Board.objects.get(id=self.kwargs['board_id'])
        # automatically create headers/rows
        result = super(CreateTable, self).form_valid(form)
        header, _ = HeaderRowItem.objects.get_or_create(table=self.object)
        first_row, _ = TableRow.objects.get_or_create(table=self.object)
        _, _ = TableItem.objects.get_or_create(board=self.object.board, table_row=first_row, table_head=header)
        return result

    def get_success_url(self) -> str:
        # board_id = self.kwargs['board_id']
        return reverse_lazy('edit-table', kwargs={'table_id': self.object.pk})


def edit_table(request, table_id):

    # if request.method == 'GET':
    #context   
    tbl = Table.objects.get(id=table_id)
    tbl_items = TableItem.objects.filter(table_row__table=tbl)
    rows = TableRow.objects.filter(table=tbl)
    header_items = HeaderRowItem.objects.filter(table=tbl)

    InfoFormSet = formset_factory(AddTableInfoFormSet, extra=0)
    tbl_formset = InfoFormSet(initial=[{'table_item_id':item.id, 'text':item.text} for item in tbl_items], prefix='tbl_item_formset')
    HeaderFormSet = formset_factory(HeaderRowFormSet, extra=0)
    head_formset = HeaderFormSet(initial=[{'header_item_id':item.id, 'header_text':item.text} for item in header_items], prefix='header_formset')
    RowFormSet = formset_factory(HeaderColFormSet, extra=0)
    row_formset = RowFormSet(initial=[{'row_id':item.id, 'row_header_text':item.header_column} for item in rows], prefix='row_formset')

    context = {
        'table': tbl,
        'headers': header_items,
        'rows': rows,
        'table_items': tbl_items,
        'add_row_col': AddRowColForm(),
        'tbl_item_formset':tbl_formset,
        'header_formset': head_formset,
        'row_formset': row_formset
    }

    if request.method == 'POST':
        tbl = Table.objects.get(id=table_id)

        # header rows
        header_formset = HeaderFormSet(request.POST, prefix='header_formset')
        if header_formset.is_valid():
            for form in header_formset:
                header_item_id = form.cleaned_data.get('header_item_id')
                header_item = HeaderRowItem.objects.get(id=header_item_id)
                header_item.text = form.cleaned_data.get('header_text')
                header_item.save()

        # header columns
        header_row_formset = RowFormSet(request.POST, prefix='row_formset')
        if header_row_formset.is_valid():
            for form in header_row_formset:
                row_id = form.cleaned_data.get('row_id')
                row = TableRow.objects.get(id=row_id)
                row.header_column = form.cleaned_data.get('row_header_text')
                row.save()

        # add info
        tbl_item_formset = InfoFormSet(request.POST, prefix='tbl_item_formset')
        if tbl_item_formset.is_valid():
            for form in tbl_item_formset:
                tbl_item_id = form.cleaned_data.get('table_item_id')
                tbl_item = TableItem.objects.get(id=tbl_item_id)
                tbl_item.text = form.cleaned_data.get('text')
                tbl_item.save()
        
        # add rows/columns 
        add_row_col = AddRowColForm(request.POST)
        if add_row_col.is_valid():
            to_add = add_row_col.cleaned_data.get('row_or_col')
            # add column
            if to_add == 'col':
                head = HeaderRowItem.objects.create(table=tbl)
                rows = TableRow.objects.filter(table=tbl)
                for row in rows:
                    _ = TableItem.objects.create(board=tbl.board, table_row=row, table_head=head)
                tbl.num_cols += 1
                return redirect('edit-table', table_id=table_id) #don't go back to main page
            # add row
            elif to_add == 'row':
                row = TableRow.objects.create(table=tbl)
                header_row_items = HeaderRowItem.objects.filter(table=tbl)
                for col in header_row_items:#_ in range(tbl.num_cols):
                    _ = TableItem.objects.create(board=tbl.board, table_row=row, table_head=col)
                tbl.num_rows += 1
                return redirect('edit-table', table_id=table_id) #don't go back to main page
        tbl.save()

        return redirect('board-view', board_id = tbl.board.id) #return to board page if submit button class="btn btn-outline-primary" was pressed
    
    return render(request, 'flashcards/edit_table.html', context)



# HELPFUL METHODS ---------------------------------------------------------------------------------------------------------


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.simple_tag
def increment_variable(value):
    return value+1