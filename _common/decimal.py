import random

from decimal import Decimal, Context, setcontext, InvalidOperation, DivisionByZero, Overflow, \
    ROUND_HALF_EVEN, DefaultContext

PREC = 24
DECIMAL_PLACES_LONG = 16
DECIMAL_PLACES_LONG_18 = 18
MAX_DIGITS_LONG = 38

DECIMAL_PLACES_SHORT = 8
MAX_DIGITS_SHORT = 30

QUANT_SHORT = Decimal('1E-8')
QUANT_LONG = Decimal('1E-16')


def quantize_q(value: Decimal, quant: Decimal, rounding=ROUND_HALF_EVEN):
    if quant > value > -quant:
        return Decimal(0)

    return value.quantize(quant, rounding=rounding)


def quantize(value: Decimal, use_8: bool = True, rounding=ROUND_HALF_EVEN) -> Decimal:
    quant = QUANT_SHORT if use_8 else QUANT_LONG

    if quant > value > -quant:
        return Decimal(0)

    return value.quantize(quant, rounding=rounding)


def random_decimal(start: int = 1,
                   end: int = 10000,
                   decimal_places: int = 5,
                   additional_place: int = 0,
                   use_8: bool = True) -> Decimal:
    _mult = int(10 ** decimal_places)

    res = Decimal(random.randrange(start * _mult, end * _mult))

    res /= int(10 ** (decimal_places + additional_place))

    if res.is_zero():
        res = Decimal(0)

    return quantize(res, use_8)


def init_decimal_context():
    DefaultContext.prec = PREC
    DefaultContext.rounding = ROUND_HALF_EVEN


def remove_exponent(num: Decimal) -> Decimal:
    return num.to_integral() if num == num.to_integral() else num.normalize()
