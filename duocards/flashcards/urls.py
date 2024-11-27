from django.urls import path
from . import views

urlpatterns = [
    path('', views.HomePage.as_view(), name='home'),
    path('study/<str:study_mode>/<str:category>/<int:category_id>/card/<int:pk>/from/<str:start_loc>/', 
         views.StudyView.as_view(), name='study'),

    path('class/<str:course_slug>/create-board/', views.CreateBoard.as_view(), name='create-board'),
    path('board/<int:board_id>/', views.BoardView.as_view(), name='board-view'),

    path('create-course/', views.CreateCourse.as_view(), name='create-course'),
    path('class/<str:course_slug>/', views.CourseView.as_view(), name='course-view'),

    path('board/<int:board_id>/create-card/', views.CreateCard.as_view(), name='create-card'),
    path('board/<int:board_id>/create-table/', views.CreateTable.as_view(), name='create-table'),
    # path('table/<int:table_id>/edit/', views.EditTable.as_view(), name='edit-table'),
    path('table/<int:table_id>/edit/', views.edit_table, name='edit-table'),

    # path('flashcard_item', )
]