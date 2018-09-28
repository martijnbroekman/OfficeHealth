import json
from collections import namedtuple
from enum import Enum
import os

DIVIDER = 10


class PostureScore(Enum):
    Green = 1
    Yellow = 2
    Orange = 3
    Red = 4


class Settings:

    def __init__(self, x, y, w, h):
        self.x = x
        self.y = y
        self.w = w
        self.h = h


def rect_to_bb(rect):
    x = rect.left()
    y = rect.top()
    w = rect.right() - x
    h = rect.bottom() - y

    # Return a tuple of (x, y, w, h)
    return x, y, w, h


def check_posture(rect):
    settings = load_settings()
    score = PostureScore.Green

    # Calculate posture score for top, bottom, left and right position
    top_score = round((rect.tl_corner().y - settings.y) * -1 / DIVIDER)
    bottom_score = round((rect.bl_corner().y - (settings.y + settings.h)) / DIVIDER)
    left_score = round((rect.tl_corner().x - settings.x) * -1 / DIVIDER)
    right_score = round((rect.tr_corner().x - (settings.x + settings.h)) / DIVIDER)

    if top_score >= 4 or bottom_score >= 4 or left_score >= 4 or right_score > 4:
        score = PostureScore.Red
    elif top_score >= 3 or bottom_score >= 3 or left_score >= 3 or right_score > 3:
        score = PostureScore.Orange
    elif top_score == 2 or bottom_score == 2 or left_score == 2 or right_score == 2:
        score = PostureScore.Yellow

    return score.value


def save_face(face_found):
    (xf, yf, wf, hf) = rect_to_bb(face_found)
    settings = Settings(xf, yf, wf, hf)

    with open("settings.json", "w") as out:
        json.dump(settings.__dict__, out)


def load_settings():
    settings_file = open("settings.json")
    return json.loads(settings_file.read(), object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))
