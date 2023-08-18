import logging

from django.utils.deprecation import MiddlewareMixin
from pydantic import ValidationError

from _common.arch.exceptions import NotExist404
from _common.http import ErrorResponse, Responses


# noinspection PyMethodMayBeStatic
class CRMiddleware(MiddlewareMixin):
    def __init__(self, get_response):
        super().__init__(get_response)

    def process_exception(self, request, exception):
        _type = type(exception)

        if _type == ValidationError:
            result = {}
            for e in exception.errors():
                if len(e['loc']):
                    result['.'.join(e['loc'])] = e['msg']
            return ErrorResponse(result)
        elif _type == NotExist404:
            return ErrorResponse(exception.error, code=404)
        else:
            logging.exception(exception)
            return Responses.Err500
