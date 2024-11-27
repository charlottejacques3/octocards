# IMPORT STATEMENTS -------------------------------------------------------------------------------------------------------

from django.db import models
from django.urls import reverse
from django.utils import timezone
from django.utils.timezone import localdate
from django.db.models import Q
from django.utils.text import slugify
from django.utils.translation import gettext_lazy as _
from model_utils.managers import InheritanceManager

from django.db.models.signals import post_delete
from django.dispatch import receiver


# CONSTANTS --------------------------------------------------------------------------------------------------------------- 

# describe how many days to increment the due date (from the previous date) based on the study stage
# uses this schedule: https://traverse.link/spaced-repetition/the-optimal-spaced-repetition-schedule
STAGE_0 = 0 # the first day, this constant is not actually used
STAGE_1 = 1 - STAGE_0
STAGE_2 = 6 - STAGE_1
STAGE_3 = 14 - STAGE_2
STAGE_4 = 30 - STAGE_3
STAGE_5 = 66 - STAGE_4
STAGE_6 = 150 - STAGE_5
STAGE_7 = 360 - STAGE_6


# COURSE MODEL -----------------------------------------------------------------------------------------------------------

class Course(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Course, self).save(*args, **kwargs)

    def __str__(self):
        return self.name


# BOARD MODEL -----------------------------------------------------------------------------------------------------

class Board(models.Model):
    name = models.CharField(max_length=200)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        course_name = 'No course'
        if self.course is not None:
            course_name = self.course.name
        return self.name + ' (' + course_name + ')'
    

# TABLE MODEL -----------------------------------------------------------------------------------------------------

class Table(models.Model):
    name = models.CharField(max_length=200)
    num_rows = models.IntegerField(default=1) #don't need??
    num_cols = models.IntegerField(default=1)
    board = models.ForeignKey(Board, on_delete=models.CASCADE) 

    def __str__(self):
        return self.name + ' (' + self.board.name + ')'


class TableRow(models.Model):
    header_column = models.CharField(max_length=300, null=True, blank=True)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)

    def __str__(self):
        return str_helper(self.header_column) + ' (' + self.table.name + ')'


class HeaderRowItem(models.Model):
    text = models.CharField(max_length=300, null=True, blank=True)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)

    def __str__(self):
        return str_helper(self.text) + ' (' + self.table.name + ')'


# class Header(models.Model):
#     ROW = 'R'
#     COL = 'C'
#     HEADER_TYPE_CHOICES = [
#         (ROW, 'Row'),
#         (COL, 'Column')
#     ]
#     type = models.CharField(
#         max_length=1,
#         choices=HEADER_TYPE_CHOICES,
#         default=ROW,
#     )
    
#     text = models.CharField(max_length=300, default='')
#     table = models.ForeignKey(Table, on_delete=models.CASCADE)


# ITEM MODELS -----------------------------------------------------------------------------------------------------

class GenericItem(models.Model):
    # ITEM_TYPE_CHOICES = [
    #     (FLASHCARD, 'Flashcard'),
    #     (TABLE, 'Table')
    # ]

    # due_date = models.DateField(default=timezone.now())
    due_date = models.DateField(auto_now_add=True)
    study_stage = models.IntegerField(default=0) #used to be 1, changed it
    repeating_today = models.BooleanField(default=False)
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    objects = InheritanceManager()

    # class Meta:
    #     abstract = True

    # def get_absolute_url(self):
    
    @staticmethod
    def get_all_ids(board_cards):
        board_cards = board_cards.order_by('id').values()
        return board_cards.values_list('id', flat=True)
    
    @staticmethod
    def get_due_card_ids(board_cards):
        due_cards = board_cards.filter(Q(due_date__lte=localdate()) | Q(repeating_today=True))
        due_cards = due_cards.order_by('repeating_today', 'due_date', 'id').values()
        return due_cards.values_list('id', flat=True)

    @staticmethod
    def get_first_id(lo_ids):
        try:
            first_card = lo_ids[0]
        except IndexError:
            first_card = -1
        return first_card
    
    def calc_new_due_date(self, status: str):
        repeatToday = False
        if status == 'Correct' or (status == 'Partly Correct' and self.study_stage == 0):
            self.study_stage += 1
        elif status == 'Incorrect':
            if self.study_stage > 1:
                self.study_stage -= 1
            repeatToday = True

        if not repeatToday:
            stage = self.study_stage
            increment = 0
            if stage == 1:
                increment = STAGE_1
            elif stage == 2:
                increment = STAGE_2
            elif stage == 3:
                increment = STAGE_3
            elif stage == 4:
                increment = STAGE_4
            elif stage == 5:
                increment = STAGE_5
            elif stage == 6:
                increment = STAGE_6
            elif stage >= 7:
                increment = STAGE_7
            self.due_date = timezone.now() + timezone.timedelta(days=increment)
        
        self.repeating_today = repeatToday
        self.save()
        return self


class FlashcardItem(GenericItem):
    question = models.CharField(max_length=500)
    answer = models.TextField()

    def __str__(self):
        return self.question


class TableItem(GenericItem):
    # row_num = models.IntegerField()
    # col_num = models.IntegerField()
    table_row = models.ForeignKey(TableRow, on_delete=models.CASCADE) 
    table_head = models.ForeignKey(HeaderRowItem, on_delete=models.CASCADE)
    text = models.TextField(null=True, blank=True)
    active = models.BooleanField(default=False) #whether it's an actual card or just a blank spot on the table

    def __str__(self):
        return str_helper(self.text) + ' (' + self.table_row.table.name + ')'
    
    #overriding save method to override board, does this map to the board field properly??
    # def save(self, *args, **kwargs):
    #     self.board = self.table.board
    #     super(TableItem, self).save(*args, **kwargs)



def str_helper(val) -> str:
    if val is None:
        text = 'null'
    else:
        text = val
    return text


@receiver(post_delete, sender=TableRow)
def updateRows(sender, instance, using, **kwargs):
    instance.table.num_rows -= 1
    instance.table.save()


@receiver(post_delete, sender=HeaderRowItem)
def updateRows(sender, instance, using, **kwargs):
    instance.table.num_cols -= 1
    instance.table.save()