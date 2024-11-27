from .models import Course

def class_list(request):
    # if request.user.is_authenticated:
    #     no_msgs = request.user.profile.msgs
    # else:
    #     no_msgs = 0
    all_classes = Course.objects.all()
    return {
        'menu_classes' : all_classes
    }