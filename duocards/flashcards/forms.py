from typing import Any
from django import forms
from django.forms import BaseFormSet
from django.forms import formset_factory

class CorrectForm(forms.Form):
    card_id = forms.IntegerField(required=True)
    correct_or_not = forms.CharField(required=True)

class AddRowColForm(forms.Form):
    row_or_col = forms.CharField(required=False)

class AddTableInfoFormSet(forms.Form):
    table_item_id = forms.IntegerField(required=False)#, widget=forms.HiddenInput())
    text = forms.CharField(required=False)

class HeaderRowFormSet(forms.Form):
    header_item_id = forms.IntegerField(required=False)
    header_text = forms.CharField(required=False)

class HeaderColFormSet(forms.Form):
    row_id = forms.IntegerField(required=False)
    row_header_text = forms.CharField(required=False)

class SampleForm(forms.Form):
    name = forms.CharField(required=True)