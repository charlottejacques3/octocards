from django.contrib import admin
from .models import *

class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    prepopulated_fields = {'slug': ('name',)}

class BoardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'course')
    list_filter = ('course',)

class FlashcardItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'question', 'due_date', 'study_stage', 'repeating_today')
    list_filter = ('due_date', 'study_stage')

class TableAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'board')
    list_filter = ('board',)

class TableRowAdmin(admin.ModelAdmin):
    list_display = ('header_column', 'table')
    list_filter = ('table',)

class TableItemAdmin(admin.ModelAdmin):
    # model = TableItem
    list_display = ('id', 'text', 'due_date', 'study_stage', 'repeating_today', 'table_row', 'table_head')#, 'get_table')
    list_filter = ('due_date', 'study_stage')

    # @admin.display(description='Table', ordering='table_row__table__name')
    # def get_table(self, obj):
    #     return obj.table_row__table__name

class HeaderRowItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'text', 'table')
    list_filter = ('table',)


# Register your models here.
admin.site.register(Course, CourseAdmin)
admin.site.register(Board, BoardAdmin) 
admin.site.register(FlashcardItem, FlashcardItemAdmin)
admin.site.register(Table, TableAdmin)
admin.site.register(TableRow, TableRowAdmin)
admin.site.register(TableItem, TableItemAdmin)
admin.site.register(HeaderRowItem, HeaderRowItemAdmin)
