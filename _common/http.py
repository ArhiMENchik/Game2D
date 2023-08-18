import json

from decimal import Decimal
from uuid import UUID

from django.http import HttpResponse

from _common.data import Errors, DataKeys
from _common.decimal import remove_exponent


class CRJsonEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return str(remove_exponent(o))
        elif isinstance(o, UUID):
            return str(o)
        else:
            return str(o)


class SuccessResponse(HttpResponse):
    def __init__(self, data=None):
        if isinstance(data, bytes):
            content = b''.join((DataKeys.SUCCESS_RESPONSE_PREFIX,
                                data, DataKeys.SUCCESS_RESPONSE_POSTFIX))
        else:
            content = json.dumps({
                DataKeys.SUCCESS: True,
                DataKeys.RESULT: data
            }, cls=CRJsonEncoder)

        HttpResponse.__init__(self, content, content_type='text/json')


class ErrorResponse(HttpResponse):
    def __init__(self, data: dict | str | list = None, code=200):
        if isinstance(data, str):
            data = data
        if isinstance(data, list) or isinstance(data, dict):
            data = data

        data = data if data else {}

        content = json.dumps({
            DataKeys.SUCCESS: False,
            DataKeys.RESULT: None,
            DataKeys.ERRORS: data
        }, default=str)

        HttpResponse.__init__(self, content, content_type='text/json', status=code)


class Responses:
    NotFound = ErrorResponse(Errors.ERROR_404, code=404)

    Err500 = ErrorResponse(Errors.INTERNAL_SERVER_ERROR, code=500)

    Err501 = ErrorResponse(Errors.NOT_IMPLEMENTED, code=501)

    EmailNotVerified = ErrorResponse('Email is not verified')
    PermissionDenied = ErrorResponse(Errors.PERMISSION_DENIED)

    AuthenticationError = ErrorResponse('Authentication Error')

    TwoFaNotActive = ErrorResponse('2-FA not active')


def get_client_info(request):
    ip_address = request.META.get('HTTP_X_FORWARDED_FOR', '') or request.META.get('REMOTE_ADDR', '')
    ip_address = ip_address.split(', ')[0]
    user_agent = request.META['HTTP_USER_AGENT']
    return ip_address, user_agent
