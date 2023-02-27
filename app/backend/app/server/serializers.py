"""
Serializers for the record api
"""

from rest_framework import serializers
from core.models import (
    ImageRecord,
    Location,
)

class ImageRecordSerializer(serializers.ModelSerializer):
    """Serializer for Image records"""

    class Meta:
        model = ImageRecord
        fields = ['id',
                  'location',
                  'date',
                  'image_ir',
                  'image_rgb',
                  'image_masked',
                  'is_hotspot',
                  'is_classified',
                  'status'
                ]
        read_only_fields = ['id']
        extra_kwargs = {'image_rgb':{'required':'True'},'image_ir':{'required':'True'}}


class ImageRecordUploadSerializer(serializers.ModelSerializer):
    """Serializer for Image records"""

    class Meta:
        model = ImageRecord
        fields = ['id',
                  'location',
                  'date',
                  'image_ir',
                  'image_rgb'
                ]
        read_only_fields = ['id']
        extra_kwargs = {'image_rgb':{'required':'True'},'image_ir':{'required':'True'}}
        
class StatusSerializer(serializers.ModelSerializer):
    """Serializer for Image records"""
    class Meta:
        model = ImageRecord
        fields = ['id','status']
        read_only_fields = ['id']

class UnclassifiedRecordSerializer(serializers.ModelSerializer):
    """Serializer for Image records"""
    class Meta:
        model = ImageRecord
        fields = ['id','image_ir','image_rgb']
        read_only_fields = ['id']

class NewClassificationSerializer(serializers.ModelSerializer):
    """Serializer for Image records"""
    class Meta:
        model = ImageRecord
        fields = ['id','image_masked','is_classified','is_hotspot']
        read_only_fields = ['id']

        

class LocationSerializer(serializers.ModelSerializer):
    """Serializer for Location records"""

    class Meta:
        model = Location
        fields = ['id','x','y','path_id']
        read_only_fields = ['id']

