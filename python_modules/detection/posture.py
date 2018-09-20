import dlib


def check_posture(rect):
    #TODO replace with settings
    settingrect = dlib.rectangle(120, 120, 280, 280)

    return rect.tr_corner().x > settingrect.tr_corner().x or rect.tl_corner().x < settingrect.tl_corner().x or \
           rect.br_corner().y > settingrect.br_corner().y or rect.tl_corner().y < settingrect.tl_corner().y