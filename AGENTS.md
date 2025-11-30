# 컴퓨터 그래픽스 실습 및 과제 디렉토리
## 과제 2 예정
### 채점 기준
1. Point Light 구현 및 상호작용 (5점)
2. Spot Light 구현 및 상호작용 (5점)

### 구현 내용
1. Point Light
    1. 임의의 2개 fragment f1, f2에 대해서 Directional Light의 경우 빛을 향하는 벡터 l이 fragment의 위치와 관계없이 동일한 방향을 가진 벡터로 가정하여 계산한다.
    2. Point Light의 경우 가까이 존재하는 광원이기 때문에, fragment별로 벡터 l을 다르게 정의하여 라이팅 효과를 계산한다. 그 결과, fragment별로 normal과 l이 이루는 각도가 빠르게 바뀌기  때문에 빛의 위치에 따르는 조명 효과가 뚜렷하게 나타나게 된다.
    3. Point Light의 경우 근접 광원이기 때문에, 거리에 비례하여 빛이 감쇄(attenuation)하는 효과를 고려하여 색상을 계산한다.
    4. 감쇄에 따르는 최종 색상은 다음과 같이 계산한다. Attenuated Color = color/(d^2 + 0.01)    where d is a distance between fragment and point light source \n 부노의 0.01의 경우 수치적 안정성 확보의 목적으로 0으로 나누는 경우를 방지하기 위해 삽입한다.
    5. Point light의 위치는 슬라이더를 통해 조정하고 슬라이더는 Position X, Y, Z 라는 3개의 슬라이더로 이루어져있다.
    6. Point light의 초기 색상은 [0,0,1], 초기 위치는 [2,1,-2]이며 ambient intensity = 0, diffuse intensity = 1 이다.

2. Spot Light
    1. Spot light는 손정등과 같이 빛이 닿는 각도가 한정되어 있는 조명이며 위치와 방향, 그리고 cutoff 각도 속성을 갖는다.
    2. Cutoff 각도를 벗어난 fragment는 조명의 효과를 받지 않으며, 각도 내에 존재하는 fragment만 spot light에 의해 조명 효과가 계산된다.
    3. 간단한 계산을 위해 spot light에는 감쇄 효과는 적용하지 않는다.
    4. Spot light의 위치는 헤드랜턴과 같이 카메라와 위치, 방향이 동일하다.
    5. Spot light의 경우 슬라이더를 통해 조명의 빛이 비추는 각도(cutoff)를 조정할 수 있다.
    6. Spot light의 색상은 [1,0,0], cutoff angle은 45도, ambient intensity = 0, diffuse intensity = 1 이다.
    7. GLSL에는 radians()함수가 존재하며, degree 값을 인자로 너껴주면 라디안 값을 반환해주므로 활용하는것이 좋다.

