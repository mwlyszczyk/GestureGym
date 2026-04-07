from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Score
from django.db.models import Max

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'User already exists'}, status=400)

    user = User.objects.create_user(username=username, password=password)

    return Response({'message': 'User created'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_score(request):
    score_value = request.data.get('score')

    if score_value is None:
        return Response({'error': 'Score required'}, status=400)

    score_value = int(score_value)

   
    score_obj, created = Score.objects.get_or_create(user=request.user)

    if created:
        score_obj.value = score_value
    else:
        score_obj.value += score_value

    score_obj.save()

    return Response({
        'message': 'Score updated',
        'new_total': score_obj.value
    })

@api_view(['GET'])
def leaderboard(request):
    scores = Score.objects.select_related('user').order_by('-value')[:10]

    data = [
        {
            "username": s.user.username,
            "score": s.value
        }
        for s in scores
    ]

    return Response(data)