var snarkjs = (function (exports) {
    'use strict';

    /* global BigInt */
    const hexLen = [ 0, 1, 2, 2, 3, 3, 3, 3, 4 ,4 ,4 ,4 ,4 ,4 ,4 ,4];

    function myStringify(o){
        return stringifyBigInts(o);
    }

    function fromString(s, radix) {
        if ((!radix)||(radix==10)) {
            return BigInt(s);
        } else if (radix==16) {
            if (s.slice(0,2) == "0x") {
                return BigInt(s);
            } else {
                return BigInt("0x"+s);
            }
        }
    }

    const e = fromString;

    function fromArray(a, radix) {
        let acc =0n;
        radix = BigInt(radix);
        for (let i=0; i<a.length; i++) {
            acc = acc*radix + BigInt(a[i]);
        }
        return acc;
    }

    function bitLength(a) {
        const aS =a.toString(16);
        return (aS.length-1)*4 +hexLen[parseInt(aS[0], 16)];
    }

    function isNegative(a) {
        return BigInt(a) < 0n;
    }

    function isZero(a) {
        return !a;
    }

    function shiftLeft(a, n) {
        return BigInt(a) << BigInt(n);
    }

    function shiftRight(a, n) {
        return BigInt(a) >> BigInt(n);
    }

    const shl = shiftLeft;
    const shr = shiftRight;

    function isOdd(a) {
        return (BigInt(a) & 1n) == 1n;
    }


    function naf(n) {
        let E = BigInt(n);
        const res = [];
        while (E) {
            if (E & 1n) {
                const z = 2 - Number(E % 4n);
                res.push( z );
                E = E - BigInt(z);
            } else {
                res.push( 0 );
            }
            E = E >> 1n;
        }
        return res;
    }


    function bits(n) {
        let E = BigInt(n);
        const res = [];
        while (E) {
            if (E & 1n) {
                res.push(1);
            } else {
                res.push( 0 );
            }
            E = E >> 1n;
        }
        return res;
    }

    function toNumber(s) {
        if (s>BigInt(Number.MAX_SAFE_INTEGER )) {
            throw new Error("Number too big");
        }
        return Number(s);
    }

    function toArray(s, radix) {
        const res = [];
        let rem = BigInt(s);
        radix = BigInt(radix);
        while (rem) {
            res.unshift( Number(rem % radix));
            rem = rem / radix;
        }
        return res;
    }


    function add(a, b) {
        return BigInt(a) + BigInt(b);
    }

    function sub(a, b) {
        return BigInt(a) - BigInt(b);
    }

    function neg(a) {
        return -BigInt(a);
    }

    function mul(a, b) {
        return BigInt(a) * BigInt(b);
    }

    function square(a) {
        return BigInt(a) * BigInt(a);
    }

    function pow(a, b) {
        return BigInt(a) ** BigInt(b);
    }

    function exp(a, b) {
        return BigInt(a) ** BigInt(b);
    }

    function abs(a) {
        return BigInt(a) >= 0 ? BigInt(a) : -BigInt(a);
    }

    function div(a, b) {
        return BigInt(a) / BigInt(b);
    }

    function mod(a, b) {
        return BigInt(a) % BigInt(b);
    }

    function eq(a, b) {
        return BigInt(a) == BigInt(b);
    }

    function neq(a, b) {
        return BigInt(a) != BigInt(b);
    }

    function lt(a, b) {
        return BigInt(a) < BigInt(b);
    }

    function gt(a, b) {
        return BigInt(a) > BigInt(b);
    }

    function leq(a, b) {
        return BigInt(a) <= BigInt(b);
    }

    function geq(a, b) {
        return BigInt(a) >= BigInt(b);
    }

    function band(a, b) {
        return BigInt(a) & BigInt(b);
    }

    function bor(a, b) {
        return BigInt(a) | BigInt(b);
    }

    function bxor(a, b) {
        return BigInt(a) ^ BigInt(b);
    }

    function land(a, b) {
        return BigInt(a) && BigInt(b);
    }

    function lor(a, b) {
        return BigInt(a) || BigInt(b);
    }

    function lnot(a) {
        return !BigInt(a);
    }

    var Scalar_native = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fromString: fromString,
        e: e,
        fromArray: fromArray,
        bitLength: bitLength,
        isNegative: isNegative,
        isZero: isZero,
        shiftLeft: shiftLeft,
        shiftRight: shiftRight,
        shl: shl,
        shr: shr,
        isOdd: isOdd,
        naf: naf,
        bits: bits,
        toNumber: toNumber,
        toArray: toArray,
        add: add,
        sub: sub,
        neg: neg,
        mul: mul,
        square: square,
        pow: pow,
        exp: exp,
        abs: abs,
        div: div,
        mod: mod,
        eq: eq,
        neq: neq,
        lt: lt,
        gt: gt,
        leq: leq,
        geq: geq,
        band: band,
        bor: bor,
        bxor: bxor,
        land: land,
        lor: lor,
        lnot: lnot
    });

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    function commonjsRequire (target) {
    	throw new Error('Could not dynamically require "' + target + '". Please configure the dynamicRequireTargets option of @rollup/plugin-commonjs appropriately for this require call to behave properly.');
    }

    var BigInteger = createCommonjsModule(function (module) {
    var bigInt = (function (undefined$1) {

        var BASE = 1e7,
            LOG_BASE = 7,
            MAX_INT = 9007199254740992,
            MAX_INT_ARR = smallToArray(MAX_INT),
            DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";

        var supportsNativeBigInt = typeof BigInt === "function";

        function Integer(v, radix, alphabet, caseSensitive) {
            if (typeof v === "undefined") return Integer[0];
            if (typeof radix !== "undefined") return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
            return parseValue(v);
        }

        function BigInteger(value, sign) {
            this.value = value;
            this.sign = sign;
            this.isSmall = false;
        }
        BigInteger.prototype = Object.create(Integer.prototype);

        function SmallInteger(value) {
            this.value = value;
            this.sign = value < 0;
            this.isSmall = true;
        }
        SmallInteger.prototype = Object.create(Integer.prototype);

        function NativeBigInt(value) {
            this.value = value;
        }
        NativeBigInt.prototype = Object.create(Integer.prototype);

        function isPrecise(n) {
            return -MAX_INT < n && n < MAX_INT;
        }

        function smallToArray(n) { // For performance reasons doesn't reference BASE, need to change this function if BASE changes
            if (n < 1e7)
                return [n];
            if (n < 1e14)
                return [n % 1e7, Math.floor(n / 1e7)];
            return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
        }

        function arrayToSmall(arr) { // If BASE changes this function may need to change
            trim(arr);
            var length = arr.length;
            if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
                switch (length) {
                    case 0: return 0;
                    case 1: return arr[0];
                    case 2: return arr[0] + arr[1] * BASE;
                    default: return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
                }
            }
            return arr;
        }

        function trim(v) {
            var i = v.length;
            while (v[--i] === 0);
            v.length = i + 1;
        }

        function createArray(length) { // function shamelessly stolen from Yaffle's library https://github.com/Yaffle/BigInteger
            var x = new Array(length);
            var i = -1;
            while (++i < length) {
                x[i] = 0;
            }
            return x;
        }

        function truncate(n) {
            if (n > 0) return Math.floor(n);
            return Math.ceil(n);
        }

        function add(a, b) { // assumes a and b are arrays with a.length >= b.length
            var l_a = a.length,
                l_b = b.length,
                r = new Array(l_a),
                carry = 0,
                base = BASE,
                sum, i;
            for (i = 0; i < l_b; i++) {
                sum = a[i] + b[i] + carry;
                carry = sum >= base ? 1 : 0;
                r[i] = sum - carry * base;
            }
            while (i < l_a) {
                sum = a[i] + carry;
                carry = sum === base ? 1 : 0;
                r[i++] = sum - carry * base;
            }
            if (carry > 0) r.push(carry);
            return r;
        }

        function addAny(a, b) {
            if (a.length >= b.length) return add(a, b);
            return add(b, a);
        }

        function addSmall(a, carry) { // assumes a is array, carry is number with 0 <= carry < MAX_INT
            var l = a.length,
                r = new Array(l),
                base = BASE,
                sum, i;
            for (i = 0; i < l; i++) {
                sum = a[i] - base + carry;
                carry = Math.floor(sum / base);
                r[i] = sum - carry * base;
                carry += 1;
            }
            while (carry > 0) {
                r[i++] = carry % base;
                carry = Math.floor(carry / base);
            }
            return r;
        }

        BigInteger.prototype.add = function (v) {
            var n = parseValue(v);
            if (this.sign !== n.sign) {
                return this.subtract(n.negate());
            }
            var a = this.value, b = n.value;
            if (n.isSmall) {
                return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
            }
            return new BigInteger(addAny(a, b), this.sign);
        };
        BigInteger.prototype.plus = BigInteger.prototype.add;

        SmallInteger.prototype.add = function (v) {
            var n = parseValue(v);
            var a = this.value;
            if (a < 0 !== n.sign) {
                return this.subtract(n.negate());
            }
            var b = n.value;
            if (n.isSmall) {
                if (isPrecise(a + b)) return new SmallInteger(a + b);
                b = smallToArray(Math.abs(b));
            }
            return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
        };
        SmallInteger.prototype.plus = SmallInteger.prototype.add;

        NativeBigInt.prototype.add = function (v) {
            return new NativeBigInt(this.value + parseValue(v).value);
        };
        NativeBigInt.prototype.plus = NativeBigInt.prototype.add;

        function subtract(a, b) { // assumes a and b are arrays with a >= b
            var a_l = a.length,
                b_l = b.length,
                r = new Array(a_l),
                borrow = 0,
                base = BASE,
                i, difference;
            for (i = 0; i < b_l; i++) {
                difference = a[i] - borrow - b[i];
                if (difference < 0) {
                    difference += base;
                    borrow = 1;
                } else borrow = 0;
                r[i] = difference;
            }
            for (i = b_l; i < a_l; i++) {
                difference = a[i] - borrow;
                if (difference < 0) difference += base;
                else {
                    r[i++] = difference;
                    break;
                }
                r[i] = difference;
            }
            for (; i < a_l; i++) {
                r[i] = a[i];
            }
            trim(r);
            return r;
        }

        function subtractAny(a, b, sign) {
            var value;
            if (compareAbs(a, b) >= 0) {
                value = subtract(a, b);
            } else {
                value = subtract(b, a);
                sign = !sign;
            }
            value = arrayToSmall(value);
            if (typeof value === "number") {
                if (sign) value = -value;
                return new SmallInteger(value);
            }
            return new BigInteger(value, sign);
        }

        function subtractSmall(a, b, sign) { // assumes a is array, b is number with 0 <= b < MAX_INT
            var l = a.length,
                r = new Array(l),
                carry = -b,
                base = BASE,
                i, difference;
            for (i = 0; i < l; i++) {
                difference = a[i] + carry;
                carry = Math.floor(difference / base);
                difference %= base;
                r[i] = difference < 0 ? difference + base : difference;
            }
            r = arrayToSmall(r);
            if (typeof r === "number") {
                if (sign) r = -r;
                return new SmallInteger(r);
            } return new BigInteger(r, sign);
        }

        BigInteger.prototype.subtract = function (v) {
            var n = parseValue(v);
            if (this.sign !== n.sign) {
                return this.add(n.negate());
            }
            var a = this.value, b = n.value;
            if (n.isSmall)
                return subtractSmall(a, Math.abs(b), this.sign);
            return subtractAny(a, b, this.sign);
        };
        BigInteger.prototype.minus = BigInteger.prototype.subtract;

        SmallInteger.prototype.subtract = function (v) {
            var n = parseValue(v);
            var a = this.value;
            if (a < 0 !== n.sign) {
                return this.add(n.negate());
            }
            var b = n.value;
            if (n.isSmall) {
                return new SmallInteger(a - b);
            }
            return subtractSmall(b, Math.abs(a), a >= 0);
        };
        SmallInteger.prototype.minus = SmallInteger.prototype.subtract;

        NativeBigInt.prototype.subtract = function (v) {
            return new NativeBigInt(this.value - parseValue(v).value);
        };
        NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;

        BigInteger.prototype.negate = function () {
            return new BigInteger(this.value, !this.sign);
        };
        SmallInteger.prototype.negate = function () {
            var sign = this.sign;
            var small = new SmallInteger(-this.value);
            small.sign = !sign;
            return small;
        };
        NativeBigInt.prototype.negate = function () {
            return new NativeBigInt(-this.value);
        };

        BigInteger.prototype.abs = function () {
            return new BigInteger(this.value, false);
        };
        SmallInteger.prototype.abs = function () {
            return new SmallInteger(Math.abs(this.value));
        };
        NativeBigInt.prototype.abs = function () {
            return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
        };


        function multiplyLong(a, b) {
            var a_l = a.length,
                b_l = b.length,
                l = a_l + b_l,
                r = createArray(l),
                base = BASE,
                product, carry, i, a_i, b_j;
            for (i = 0; i < a_l; ++i) {
                a_i = a[i];
                for (var j = 0; j < b_l; ++j) {
                    b_j = b[j];
                    product = a_i * b_j + r[i + j];
                    carry = Math.floor(product / base);
                    r[i + j] = product - carry * base;
                    r[i + j + 1] += carry;
                }
            }
            trim(r);
            return r;
        }

        function multiplySmall(a, b) { // assumes a is array, b is number with |b| < BASE
            var l = a.length,
                r = new Array(l),
                base = BASE,
                carry = 0,
                product, i;
            for (i = 0; i < l; i++) {
                product = a[i] * b + carry;
                carry = Math.floor(product / base);
                r[i] = product - carry * base;
            }
            while (carry > 0) {
                r[i++] = carry % base;
                carry = Math.floor(carry / base);
            }
            return r;
        }

        function shiftLeft(x, n) {
            var r = [];
            while (n-- > 0) r.push(0);
            return r.concat(x);
        }

        function multiplyKaratsuba(x, y) {
            var n = Math.max(x.length, y.length);

            if (n <= 30) return multiplyLong(x, y);
            n = Math.ceil(n / 2);

            var b = x.slice(n),
                a = x.slice(0, n),
                d = y.slice(n),
                c = y.slice(0, n);

            var ac = multiplyKaratsuba(a, c),
                bd = multiplyKaratsuba(b, d),
                abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));

            var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
            trim(product);
            return product;
        }

        // The following function is derived from a surface fit of a graph plotting the performance difference
        // between long multiplication and karatsuba multiplication versus the lengths of the two arrays.
        function useKaratsuba(l1, l2) {
            return -0.012 * l1 - 0.012 * l2 + 0.000015 * l1 * l2 > 0;
        }

        BigInteger.prototype.multiply = function (v) {
            var n = parseValue(v),
                a = this.value, b = n.value,
                sign = this.sign !== n.sign,
                abs;
            if (n.isSmall) {
                if (b === 0) return Integer[0];
                if (b === 1) return this;
                if (b === -1) return this.negate();
                abs = Math.abs(b);
                if (abs < BASE) {
                    return new BigInteger(multiplySmall(a, abs), sign);
                }
                b = smallToArray(abs);
            }
            if (useKaratsuba(a.length, b.length)) // Karatsuba is only faster for certain array sizes
                return new BigInteger(multiplyKaratsuba(a, b), sign);
            return new BigInteger(multiplyLong(a, b), sign);
        };

        BigInteger.prototype.times = BigInteger.prototype.multiply;

        function multiplySmallAndArray(a, b, sign) { // a >= 0
            if (a < BASE) {
                return new BigInteger(multiplySmall(b, a), sign);
            }
            return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
        }
        SmallInteger.prototype._multiplyBySmall = function (a) {
            if (isPrecise(a.value * this.value)) {
                return new SmallInteger(a.value * this.value);
            }
            return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
        };
        BigInteger.prototype._multiplyBySmall = function (a) {
            if (a.value === 0) return Integer[0];
            if (a.value === 1) return this;
            if (a.value === -1) return this.negate();
            return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
        };
        SmallInteger.prototype.multiply = function (v) {
            return parseValue(v)._multiplyBySmall(this);
        };
        SmallInteger.prototype.times = SmallInteger.prototype.multiply;

        NativeBigInt.prototype.multiply = function (v) {
            return new NativeBigInt(this.value * parseValue(v).value);
        };
        NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;

        function square(a) {
            //console.assert(2 * BASE * BASE < MAX_INT);
            var l = a.length,
                r = createArray(l + l),
                base = BASE,
                product, carry, i, a_i, a_j;
            for (i = 0; i < l; i++) {
                a_i = a[i];
                carry = 0 - a_i * a_i;
                for (var j = i; j < l; j++) {
                    a_j = a[j];
                    product = 2 * (a_i * a_j) + r[i + j] + carry;
                    carry = Math.floor(product / base);
                    r[i + j] = product - carry * base;
                }
                r[i + l] = carry;
            }
            trim(r);
            return r;
        }

        BigInteger.prototype.square = function () {
            return new BigInteger(square(this.value), false);
        };

        SmallInteger.prototype.square = function () {
            var value = this.value * this.value;
            if (isPrecise(value)) return new SmallInteger(value);
            return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
        };

        NativeBigInt.prototype.square = function (v) {
            return new NativeBigInt(this.value * this.value);
        };

        function divMod1(a, b) { // Left over from previous version. Performs faster than divMod2 on smaller input sizes.
            var a_l = a.length,
                b_l = b.length,
                base = BASE,
                result = createArray(b.length),
                divisorMostSignificantDigit = b[b_l - 1],
                // normalization
                lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)),
                remainder = multiplySmall(a, lambda),
                divisor = multiplySmall(b, lambda),
                quotientDigit, shift, carry, borrow, i, l, q;
            if (remainder.length <= a_l) remainder.push(0);
            divisor.push(0);
            divisorMostSignificantDigit = divisor[b_l - 1];
            for (shift = a_l - b_l; shift >= 0; shift--) {
                quotientDigit = base - 1;
                if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
                    quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
                }
                // quotientDigit <= base - 1
                carry = 0;
                borrow = 0;
                l = divisor.length;
                for (i = 0; i < l; i++) {
                    carry += quotientDigit * divisor[i];
                    q = Math.floor(carry / base);
                    borrow += remainder[shift + i] - (carry - q * base);
                    carry = q;
                    if (borrow < 0) {
                        remainder[shift + i] = borrow + base;
                        borrow = -1;
                    } else {
                        remainder[shift + i] = borrow;
                        borrow = 0;
                    }
                }
                while (borrow !== 0) {
                    quotientDigit -= 1;
                    carry = 0;
                    for (i = 0; i < l; i++) {
                        carry += remainder[shift + i] - base + divisor[i];
                        if (carry < 0) {
                            remainder[shift + i] = carry + base;
                            carry = 0;
                        } else {
                            remainder[shift + i] = carry;
                            carry = 1;
                        }
                    }
                    borrow += carry;
                }
                result[shift] = quotientDigit;
            }
            // denormalization
            remainder = divModSmall(remainder, lambda)[0];
            return [arrayToSmall(result), arrayToSmall(remainder)];
        }

        function divMod2(a, b) { // Implementation idea shamelessly stolen from Silent Matt's library http://silentmatt.com/biginteger/
            // Performs faster than divMod1 on larger input sizes.
            var a_l = a.length,
                b_l = b.length,
                result = [],
                part = [],
                base = BASE,
                guess, xlen, highx, highy, check;
            while (a_l) {
                part.unshift(a[--a_l]);
                trim(part);
                if (compareAbs(part, b) < 0) {
                    result.push(0);
                    continue;
                }
                xlen = part.length;
                highx = part[xlen - 1] * base + part[xlen - 2];
                highy = b[b_l - 1] * base + b[b_l - 2];
                if (xlen > b_l) {
                    highx = (highx + 1) * base;
                }
                guess = Math.ceil(highx / highy);
                do {
                    check = multiplySmall(b, guess);
                    if (compareAbs(check, part) <= 0) break;
                    guess--;
                } while (guess);
                result.push(guess);
                part = subtract(part, check);
            }
            result.reverse();
            return [arrayToSmall(result), arrayToSmall(part)];
        }

        function divModSmall(value, lambda) {
            var length = value.length,
                quotient = createArray(length),
                base = BASE,
                i, q, remainder, divisor;
            remainder = 0;
            for (i = length - 1; i >= 0; --i) {
                divisor = remainder * base + value[i];
                q = truncate(divisor / lambda);
                remainder = divisor - q * lambda;
                quotient[i] = q | 0;
            }
            return [quotient, remainder | 0];
        }

        function divModAny(self, v) {
            var value, n = parseValue(v);
            if (supportsNativeBigInt) {
                return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
            }
            var a = self.value, b = n.value;
            var quotient;
            if (b === 0) throw new Error("Cannot divide by zero");
            if (self.isSmall) {
                if (n.isSmall) {
                    return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
                }
                return [Integer[0], self];
            }
            if (n.isSmall) {
                if (b === 1) return [self, Integer[0]];
                if (b == -1) return [self.negate(), Integer[0]];
                var abs = Math.abs(b);
                if (abs < BASE) {
                    value = divModSmall(a, abs);
                    quotient = arrayToSmall(value[0]);
                    var remainder = value[1];
                    if (self.sign) remainder = -remainder;
                    if (typeof quotient === "number") {
                        if (self.sign !== n.sign) quotient = -quotient;
                        return [new SmallInteger(quotient), new SmallInteger(remainder)];
                    }
                    return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
                }
                b = smallToArray(abs);
            }
            var comparison = compareAbs(a, b);
            if (comparison === -1) return [Integer[0], self];
            if (comparison === 0) return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];

            // divMod1 is faster on smaller input sizes
            if (a.length + b.length <= 200)
                value = divMod1(a, b);
            else value = divMod2(a, b);

            quotient = value[0];
            var qSign = self.sign !== n.sign,
                mod = value[1],
                mSign = self.sign;
            if (typeof quotient === "number") {
                if (qSign) quotient = -quotient;
                quotient = new SmallInteger(quotient);
            } else quotient = new BigInteger(quotient, qSign);
            if (typeof mod === "number") {
                if (mSign) mod = -mod;
                mod = new SmallInteger(mod);
            } else mod = new BigInteger(mod, mSign);
            return [quotient, mod];
        }

        BigInteger.prototype.divmod = function (v) {
            var result = divModAny(this, v);
            return {
                quotient: result[0],
                remainder: result[1]
            };
        };
        NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;


        BigInteger.prototype.divide = function (v) {
            return divModAny(this, v)[0];
        };
        NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function (v) {
            return new NativeBigInt(this.value / parseValue(v).value);
        };
        SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;

        BigInteger.prototype.mod = function (v) {
            return divModAny(this, v)[1];
        };
        NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function (v) {
            return new NativeBigInt(this.value % parseValue(v).value);
        };
        SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;

        BigInteger.prototype.pow = function (v) {
            var n = parseValue(v),
                a = this.value,
                b = n.value,
                value, x, y;
            if (b === 0) return Integer[1];
            if (a === 0) return Integer[0];
            if (a === 1) return Integer[1];
            if (a === -1) return n.isEven() ? Integer[1] : Integer[-1];
            if (n.sign) {
                return Integer[0];
            }
            if (!n.isSmall) throw new Error("The exponent " + n.toString() + " is too large.");
            if (this.isSmall) {
                if (isPrecise(value = Math.pow(a, b)))
                    return new SmallInteger(truncate(value));
            }
            x = this;
            y = Integer[1];
            while (true) {
                if (b & 1 === 1) {
                    y = y.times(x);
                    --b;
                }
                if (b === 0) break;
                b /= 2;
                x = x.square();
            }
            return y;
        };
        SmallInteger.prototype.pow = BigInteger.prototype.pow;

        NativeBigInt.prototype.pow = function (v) {
            var n = parseValue(v);
            var a = this.value, b = n.value;
            var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
            if (b === _0) return Integer[1];
            if (a === _0) return Integer[0];
            if (a === _1) return Integer[1];
            if (a === BigInt(-1)) return n.isEven() ? Integer[1] : Integer[-1];
            if (n.isNegative()) return new NativeBigInt(_0);
            var x = this;
            var y = Integer[1];
            while (true) {
                if ((b & _1) === _1) {
                    y = y.times(x);
                    --b;
                }
                if (b === _0) break;
                b /= _2;
                x = x.square();
            }
            return y;
        };

        BigInteger.prototype.modPow = function (exp, mod) {
            exp = parseValue(exp);
            mod = parseValue(mod);
            if (mod.isZero()) throw new Error("Cannot take modPow with modulus 0");
            var r = Integer[1],
                base = this.mod(mod);
            if (exp.isNegative()) {
                exp = exp.multiply(Integer[-1]);
                base = base.modInv(mod);
            }
            while (exp.isPositive()) {
                if (base.isZero()) return Integer[0];
                if (exp.isOdd()) r = r.multiply(base).mod(mod);
                exp = exp.divide(2);
                base = base.square().mod(mod);
            }
            return r;
        };
        NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;

        function compareAbs(a, b) {
            if (a.length !== b.length) {
                return a.length > b.length ? 1 : -1;
            }
            for (var i = a.length - 1; i >= 0; i--) {
                if (a[i] !== b[i]) return a[i] > b[i] ? 1 : -1;
            }
            return 0;
        }

        BigInteger.prototype.compareAbs = function (v) {
            var n = parseValue(v),
                a = this.value,
                b = n.value;
            if (n.isSmall) return 1;
            return compareAbs(a, b);
        };
        SmallInteger.prototype.compareAbs = function (v) {
            var n = parseValue(v),
                a = Math.abs(this.value),
                b = n.value;
            if (n.isSmall) {
                b = Math.abs(b);
                return a === b ? 0 : a > b ? 1 : -1;
            }
            return -1;
        };
        NativeBigInt.prototype.compareAbs = function (v) {
            var a = this.value;
            var b = parseValue(v).value;
            a = a >= 0 ? a : -a;
            b = b >= 0 ? b : -b;
            return a === b ? 0 : a > b ? 1 : -1;
        };

        BigInteger.prototype.compare = function (v) {
            // See discussion about comparison with Infinity:
            // https://github.com/peterolson/BigInteger.js/issues/61
            if (v === Infinity) {
                return -1;
            }
            if (v === -Infinity) {
                return 1;
            }

            var n = parseValue(v),
                a = this.value,
                b = n.value;
            if (this.sign !== n.sign) {
                return n.sign ? 1 : -1;
            }
            if (n.isSmall) {
                return this.sign ? -1 : 1;
            }
            return compareAbs(a, b) * (this.sign ? -1 : 1);
        };
        BigInteger.prototype.compareTo = BigInteger.prototype.compare;

        SmallInteger.prototype.compare = function (v) {
            if (v === Infinity) {
                return -1;
            }
            if (v === -Infinity) {
                return 1;
            }

            var n = parseValue(v),
                a = this.value,
                b = n.value;
            if (n.isSmall) {
                return a == b ? 0 : a > b ? 1 : -1;
            }
            if (a < 0 !== n.sign) {
                return a < 0 ? -1 : 1;
            }
            return a < 0 ? 1 : -1;
        };
        SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;

        NativeBigInt.prototype.compare = function (v) {
            if (v === Infinity) {
                return -1;
            }
            if (v === -Infinity) {
                return 1;
            }
            var a = this.value;
            var b = parseValue(v).value;
            return a === b ? 0 : a > b ? 1 : -1;
        };
        NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;

        BigInteger.prototype.equals = function (v) {
            return this.compare(v) === 0;
        };
        NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;

        BigInteger.prototype.notEquals = function (v) {
            return this.compare(v) !== 0;
        };
        NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;

        BigInteger.prototype.greater = function (v) {
            return this.compare(v) > 0;
        };
        NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;

        BigInteger.prototype.lesser = function (v) {
            return this.compare(v) < 0;
        };
        NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;

        BigInteger.prototype.greaterOrEquals = function (v) {
            return this.compare(v) >= 0;
        };
        NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;

        BigInteger.prototype.lesserOrEquals = function (v) {
            return this.compare(v) <= 0;
        };
        NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;

        BigInteger.prototype.isEven = function () {
            return (this.value[0] & 1) === 0;
        };
        SmallInteger.prototype.isEven = function () {
            return (this.value & 1) === 0;
        };
        NativeBigInt.prototype.isEven = function () {
            return (this.value & BigInt(1)) === BigInt(0);
        };

        BigInteger.prototype.isOdd = function () {
            return (this.value[0] & 1) === 1;
        };
        SmallInteger.prototype.isOdd = function () {
            return (this.value & 1) === 1;
        };
        NativeBigInt.prototype.isOdd = function () {
            return (this.value & BigInt(1)) === BigInt(1);
        };

        BigInteger.prototype.isPositive = function () {
            return !this.sign;
        };
        SmallInteger.prototype.isPositive = function () {
            return this.value > 0;
        };
        NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;

        BigInteger.prototype.isNegative = function () {
            return this.sign;
        };
        SmallInteger.prototype.isNegative = function () {
            return this.value < 0;
        };
        NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;

        BigInteger.prototype.isUnit = function () {
            return false;
        };
        SmallInteger.prototype.isUnit = function () {
            return Math.abs(this.value) === 1;
        };
        NativeBigInt.prototype.isUnit = function () {
            return this.abs().value === BigInt(1);
        };

        BigInteger.prototype.isZero = function () {
            return false;
        };
        SmallInteger.prototype.isZero = function () {
            return this.value === 0;
        };
        NativeBigInt.prototype.isZero = function () {
            return this.value === BigInt(0);
        };

        BigInteger.prototype.isDivisibleBy = function (v) {
            var n = parseValue(v);
            if (n.isZero()) return false;
            if (n.isUnit()) return true;
            if (n.compareAbs(2) === 0) return this.isEven();
            return this.mod(n).isZero();
        };
        NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;

        function isBasicPrime(v) {
            var n = v.abs();
            if (n.isUnit()) return false;
            if (n.equals(2) || n.equals(3) || n.equals(5)) return true;
            if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5)) return false;
            if (n.lesser(49)) return true;
            // we don't know if it's prime: let the other functions figure it out
        }

        function millerRabinTest(n, a) {
            var nPrev = n.prev(),
                b = nPrev,
                r = 0,
                d, i, x;
            while (b.isEven()) b = b.divide(2), r++;
            next: for (i = 0; i < a.length; i++) {
                if (n.lesser(a[i])) continue;
                x = bigInt(a[i]).modPow(b, n);
                if (x.isUnit() || x.equals(nPrev)) continue;
                for (d = r - 1; d != 0; d--) {
                    x = x.square().mod(n);
                    if (x.isUnit()) return false;
                    if (x.equals(nPrev)) continue next;
                }
                return false;
            }
            return true;
        }

        // Set "strict" to true to force GRH-supported lower bound of 2*log(N)^2
        BigInteger.prototype.isPrime = function (strict) {
            var isPrime = isBasicPrime(this);
            if (isPrime !== undefined$1) return isPrime;
            var n = this.abs();
            var bits = n.bitLength();
            if (bits <= 64)
                return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
            var logN = Math.log(2) * bits.toJSNumber();
            var t = Math.ceil((strict === true) ? (2 * Math.pow(logN, 2)) : logN);
            for (var a = [], i = 0; i < t; i++) {
                a.push(bigInt(i + 2));
            }
            return millerRabinTest(n, a);
        };
        NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;

        BigInteger.prototype.isProbablePrime = function (iterations, rng) {
            var isPrime = isBasicPrime(this);
            if (isPrime !== undefined$1) return isPrime;
            var n = this.abs();
            var t = iterations === undefined$1 ? 5 : iterations;
            for (var a = [], i = 0; i < t; i++) {
                a.push(bigInt.randBetween(2, n.minus(2), rng));
            }
            return millerRabinTest(n, a);
        };
        NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;

        BigInteger.prototype.modInv = function (n) {
            var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
            while (!newR.isZero()) {
                q = r.divide(newR);
                lastT = t;
                lastR = r;
                t = newT;
                r = newR;
                newT = lastT.subtract(q.multiply(newT));
                newR = lastR.subtract(q.multiply(newR));
            }
            if (!r.isUnit()) throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
            if (t.compare(0) === -1) {
                t = t.add(n);
            }
            if (this.isNegative()) {
                return t.negate();
            }
            return t;
        };

        NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;

        BigInteger.prototype.next = function () {
            var value = this.value;
            if (this.sign) {
                return subtractSmall(value, 1, this.sign);
            }
            return new BigInteger(addSmall(value, 1), this.sign);
        };
        SmallInteger.prototype.next = function () {
            var value = this.value;
            if (value + 1 < MAX_INT) return new SmallInteger(value + 1);
            return new BigInteger(MAX_INT_ARR, false);
        };
        NativeBigInt.prototype.next = function () {
            return new NativeBigInt(this.value + BigInt(1));
        };

        BigInteger.prototype.prev = function () {
            var value = this.value;
            if (this.sign) {
                return new BigInteger(addSmall(value, 1), true);
            }
            return subtractSmall(value, 1, this.sign);
        };
        SmallInteger.prototype.prev = function () {
            var value = this.value;
            if (value - 1 > -MAX_INT) return new SmallInteger(value - 1);
            return new BigInteger(MAX_INT_ARR, true);
        };
        NativeBigInt.prototype.prev = function () {
            return new NativeBigInt(this.value - BigInt(1));
        };

        var powersOfTwo = [1];
        while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE) powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
        var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];

        function shift_isSmall(n) {
            return Math.abs(n) <= BASE;
        }

        BigInteger.prototype.shiftLeft = function (v) {
            var n = parseValue(v).toJSNumber();
            if (!shift_isSmall(n)) {
                throw new Error(String(n) + " is too large for shifting.");
            }
            if (n < 0) return this.shiftRight(-n);
            var result = this;
            if (result.isZero()) return result;
            while (n >= powers2Length) {
                result = result.multiply(highestPower2);
                n -= powers2Length - 1;
            }
            return result.multiply(powersOfTwo[n]);
        };
        NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;

        BigInteger.prototype.shiftRight = function (v) {
            var remQuo;
            var n = parseValue(v).toJSNumber();
            if (!shift_isSmall(n)) {
                throw new Error(String(n) + " is too large for shifting.");
            }
            if (n < 0) return this.shiftLeft(-n);
            var result = this;
            while (n >= powers2Length) {
                if (result.isZero() || (result.isNegative() && result.isUnit())) return result;
                remQuo = divModAny(result, highestPower2);
                result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
                n -= powers2Length - 1;
            }
            remQuo = divModAny(result, powersOfTwo[n]);
            return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
        };
        NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;

        function bitwise(x, y, fn) {
            y = parseValue(y);
            var xSign = x.isNegative(), ySign = y.isNegative();
            var xRem = xSign ? x.not() : x,
                yRem = ySign ? y.not() : y;
            var xDigit = 0, yDigit = 0;
            var xDivMod = null, yDivMod = null;
            var result = [];
            while (!xRem.isZero() || !yRem.isZero()) {
                xDivMod = divModAny(xRem, highestPower2);
                xDigit = xDivMod[1].toJSNumber();
                if (xSign) {
                    xDigit = highestPower2 - 1 - xDigit; // two's complement for negative numbers
                }

                yDivMod = divModAny(yRem, highestPower2);
                yDigit = yDivMod[1].toJSNumber();
                if (ySign) {
                    yDigit = highestPower2 - 1 - yDigit; // two's complement for negative numbers
                }

                xRem = xDivMod[0];
                yRem = yDivMod[0];
                result.push(fn(xDigit, yDigit));
            }
            var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
            for (var i = result.length - 1; i >= 0; i -= 1) {
                sum = sum.multiply(highestPower2).add(bigInt(result[i]));
            }
            return sum;
        }

        BigInteger.prototype.not = function () {
            return this.negate().prev();
        };
        NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;

        BigInteger.prototype.and = function (n) {
            return bitwise(this, n, function (a, b) { return a & b; });
        };
        NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;

        BigInteger.prototype.or = function (n) {
            return bitwise(this, n, function (a, b) { return a | b; });
        };
        NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;

        BigInteger.prototype.xor = function (n) {
            return bitwise(this, n, function (a, b) { return a ^ b; });
        };
        NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;

        var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
        function roughLOB(n) { // get lowestOneBit (rough)
            // SmallInteger: return Min(lowestOneBit(n), 1 << 30)
            // BigInteger: return Min(lowestOneBit(n), 1 << 14) [BASE=1e7]
            var v = n.value,
                x = typeof v === "number" ? v | LOBMASK_I :
                    typeof v === "bigint" ? v | BigInt(LOBMASK_I) :
                        v[0] + v[1] * BASE | LOBMASK_BI;
            return x & -x;
        }

        function integerLogarithm(value, base) {
            if (base.compareTo(value) <= 0) {
                var tmp = integerLogarithm(value, base.square(base));
                var p = tmp.p;
                var e = tmp.e;
                var t = p.multiply(base);
                return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p: p, e: e * 2 };
            }
            return { p: bigInt(1), e: 0 };
        }

        BigInteger.prototype.bitLength = function () {
            var n = this;
            if (n.compareTo(bigInt(0)) < 0) {
                n = n.negate().subtract(bigInt(1));
            }
            if (n.compareTo(bigInt(0)) === 0) {
                return bigInt(0);
            }
            return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
        };
        NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;

        function max(a, b) {
            a = parseValue(a);
            b = parseValue(b);
            return a.greater(b) ? a : b;
        }
        function min(a, b) {
            a = parseValue(a);
            b = parseValue(b);
            return a.lesser(b) ? a : b;
        }
        function gcd(a, b) {
            a = parseValue(a).abs();
            b = parseValue(b).abs();
            if (a.equals(b)) return a;
            if (a.isZero()) return b;
            if (b.isZero()) return a;
            var c = Integer[1], d, t;
            while (a.isEven() && b.isEven()) {
                d = min(roughLOB(a), roughLOB(b));
                a = a.divide(d);
                b = b.divide(d);
                c = c.multiply(d);
            }
            while (a.isEven()) {
                a = a.divide(roughLOB(a));
            }
            do {
                while (b.isEven()) {
                    b = b.divide(roughLOB(b));
                }
                if (a.greater(b)) {
                    t = b; b = a; a = t;
                }
                b = b.subtract(a);
            } while (!b.isZero());
            return c.isUnit() ? a : a.multiply(c);
        }
        function lcm(a, b) {
            a = parseValue(a).abs();
            b = parseValue(b).abs();
            return a.divide(gcd(a, b)).multiply(b);
        }
        function randBetween(a, b, rng) {
            a = parseValue(a);
            b = parseValue(b);
            var usedRNG = rng || Math.random;
            var low = min(a, b), high = max(a, b);
            var range = high.subtract(low).add(1);
            if (range.isSmall) return low.add(Math.floor(usedRNG() * range));
            var digits = toBase(range, BASE).value;
            var result = [], restricted = true;
            for (var i = 0; i < digits.length; i++) {
                var top = restricted ? digits[i] : BASE;
                var digit = truncate(usedRNG() * top);
                result.push(digit);
                if (digit < top) restricted = false;
            }
            return low.add(Integer.fromArray(result, BASE, false));
        }

        var parseBase = function (text, base, alphabet, caseSensitive) {
            alphabet = alphabet || DEFAULT_ALPHABET;
            text = String(text);
            if (!caseSensitive) {
                text = text.toLowerCase();
                alphabet = alphabet.toLowerCase();
            }
            var length = text.length;
            var i;
            var absBase = Math.abs(base);
            var alphabetValues = {};
            for (i = 0; i < alphabet.length; i++) {
                alphabetValues[alphabet[i]] = i;
            }
            for (i = 0; i < length; i++) {
                var c = text[i];
                if (c === "-") continue;
                if (c in alphabetValues) {
                    if (alphabetValues[c] >= absBase) {
                        if (c === "1" && absBase === 1) continue;
                        throw new Error(c + " is not a valid digit in base " + base + ".");
                    }
                }
            }
            base = parseValue(base);
            var digits = [];
            var isNegative = text[0] === "-";
            for (i = isNegative ? 1 : 0; i < text.length; i++) {
                var c = text[i];
                if (c in alphabetValues) digits.push(parseValue(alphabetValues[c]));
                else if (c === "<") {
                    var start = i;
                    do { i++; } while (text[i] !== ">" && i < text.length);
                    digits.push(parseValue(text.slice(start + 1, i)));
                }
                else throw new Error(c + " is not a valid character");
            }
            return parseBaseFromArray(digits, base, isNegative);
        };

        function parseBaseFromArray(digits, base, isNegative) {
            var val = Integer[0], pow = Integer[1], i;
            for (i = digits.length - 1; i >= 0; i--) {
                val = val.add(digits[i].times(pow));
                pow = pow.times(base);
            }
            return isNegative ? val.negate() : val;
        }

        function stringify(digit, alphabet) {
            alphabet = alphabet || DEFAULT_ALPHABET;
            if (digit < alphabet.length) {
                return alphabet[digit];
            }
            return "<" + digit + ">";
        }

        function toBase(n, base) {
            base = bigInt(base);
            if (base.isZero()) {
                if (n.isZero()) return { value: [0], isNegative: false };
                throw new Error("Cannot convert nonzero numbers to base 0.");
            }
            if (base.equals(-1)) {
                if (n.isZero()) return { value: [0], isNegative: false };
                if (n.isNegative())
                    return {
                        value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber()))
                            .map(Array.prototype.valueOf, [1, 0])
                        ),
                        isNegative: false
                    };

                var arr = Array.apply(null, Array(n.toJSNumber() - 1))
                    .map(Array.prototype.valueOf, [0, 1]);
                arr.unshift([1]);
                return {
                    value: [].concat.apply([], arr),
                    isNegative: false
                };
            }

            var neg = false;
            if (n.isNegative() && base.isPositive()) {
                neg = true;
                n = n.abs();
            }
            if (base.isUnit()) {
                if (n.isZero()) return { value: [0], isNegative: false };

                return {
                    value: Array.apply(null, Array(n.toJSNumber()))
                        .map(Number.prototype.valueOf, 1),
                    isNegative: neg
                };
            }
            var out = [];
            var left = n, divmod;
            while (left.isNegative() || left.compareAbs(base) >= 0) {
                divmod = left.divmod(base);
                left = divmod.quotient;
                var digit = divmod.remainder;
                if (digit.isNegative()) {
                    digit = base.minus(digit).abs();
                    left = left.next();
                }
                out.push(digit.toJSNumber());
            }
            out.push(left.toJSNumber());
            return { value: out.reverse(), isNegative: neg };
        }

        function toBaseString(n, base, alphabet) {
            var arr = toBase(n, base);
            return (arr.isNegative ? "-" : "") + arr.value.map(function (x) {
                return stringify(x, alphabet);
            }).join('');
        }

        BigInteger.prototype.toArray = function (radix) {
            return toBase(this, radix);
        };

        SmallInteger.prototype.toArray = function (radix) {
            return toBase(this, radix);
        };

        NativeBigInt.prototype.toArray = function (radix) {
            return toBase(this, radix);
        };

        BigInteger.prototype.toString = function (radix, alphabet) {
            if (radix === undefined$1) radix = 10;
            if (radix !== 10) return toBaseString(this, radix, alphabet);
            var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
            while (--l >= 0) {
                digit = String(v[l]);
                str += zeros.slice(digit.length) + digit;
            }
            var sign = this.sign ? "-" : "";
            return sign + str;
        };

        SmallInteger.prototype.toString = function (radix, alphabet) {
            if (radix === undefined$1) radix = 10;
            if (radix != 10) return toBaseString(this, radix, alphabet);
            return String(this.value);
        };

        NativeBigInt.prototype.toString = SmallInteger.prototype.toString;

        NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function () { return this.toString(); };

        BigInteger.prototype.valueOf = function () {
            return parseInt(this.toString(), 10);
        };
        BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;

        SmallInteger.prototype.valueOf = function () {
            return this.value;
        };
        SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
        NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function () {
            return parseInt(this.toString(), 10);
        };

        function parseStringValue(v) {
            if (isPrecise(+v)) {
                var x = +v;
                if (x === truncate(x))
                    return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
                throw new Error("Invalid integer: " + v);
            }
            var sign = v[0] === "-";
            if (sign) v = v.slice(1);
            var split = v.split(/e/i);
            if (split.length > 2) throw new Error("Invalid integer: " + split.join("e"));
            if (split.length === 2) {
                var exp = split[1];
                if (exp[0] === "+") exp = exp.slice(1);
                exp = +exp;
                if (exp !== truncate(exp) || !isPrecise(exp)) throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
                var text = split[0];
                var decimalPlace = text.indexOf(".");
                if (decimalPlace >= 0) {
                    exp -= text.length - decimalPlace - 1;
                    text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
                }
                if (exp < 0) throw new Error("Cannot include negative exponent part for integers");
                text += (new Array(exp + 1)).join("0");
                v = text;
            }
            var isValid = /^([0-9][0-9]*)$/.test(v);
            if (!isValid) throw new Error("Invalid integer: " + v);
            if (supportsNativeBigInt) {
                return new NativeBigInt(BigInt(sign ? "-" + v : v));
            }
            var r = [], max = v.length, l = LOG_BASE, min = max - l;
            while (max > 0) {
                r.push(+v.slice(min, max));
                min -= l;
                if (min < 0) min = 0;
                max -= l;
            }
            trim(r);
            return new BigInteger(r, sign);
        }

        function parseNumberValue(v) {
            if (supportsNativeBigInt) {
                return new NativeBigInt(BigInt(v));
            }
            if (isPrecise(v)) {
                if (v !== truncate(v)) throw new Error(v + " is not an integer.");
                return new SmallInteger(v);
            }
            return parseStringValue(v.toString());
        }

        function parseValue(v) {
            if (typeof v === "number") {
                return parseNumberValue(v);
            }
            if (typeof v === "string") {
                return parseStringValue(v);
            }
            if (typeof v === "bigint") {
                return new NativeBigInt(v);
            }
            return v;
        }
        // Pre-define numbers in range [-999,999]
        for (var i = 0; i < 1000; i++) {
            Integer[i] = parseValue(i);
            if (i > 0) Integer[-i] = parseValue(-i);
        }
        // Backwards compatibility
        Integer.one = Integer[1];
        Integer.zero = Integer[0];
        Integer.minusOne = Integer[-1];
        Integer.max = max;
        Integer.min = min;
        Integer.gcd = gcd;
        Integer.lcm = lcm;
        Integer.isInstance = function (x) { return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt; };
        Integer.randBetween = randBetween;

        Integer.fromArray = function (digits, base, isNegative) {
            return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
        };

        return Integer;
    })();

    // Node.js check
    if ( module.hasOwnProperty("exports")) {
        module.exports = bigInt;
    }
    });

    function fromString$1(s, radix) {
        if (typeof s == "string") {
            if (s.slice(0,2) == "0x") {
                return BigInteger(s.slice(2), 16);
            } else {
                return BigInteger(s,radix);
            }
        } else {
            return BigInteger(s, radix);
        }
    }

    const e$1 = fromString$1;

    function fromArray$1(a, radix) {
        return BigInteger.fromArray(a, radix);
    }

    function bitLength$1(a) {
        return BigInteger(a).bitLength();
    }

    function isNegative$1(a) {
        return BigInteger(a).isNegative();
    }

    function isZero$1(a) {
        return BigInteger(a).isZero();
    }

    function shiftLeft$1(a, n) {
        return BigInteger(a).shiftLeft(n);
    }

    function shiftRight$1(a, n) {
        return BigInteger(a).shiftRight(n);
    }

    const shl$1 = shiftLeft$1;
    const shr$1 = shiftRight$1;

    function isOdd$1(a) {
        return BigInteger(a).isOdd();
    }


    function naf$1(n) {
        let E = BigInteger(n);
        const res = [];
        while (E.gt(BigInteger.zero)) {
            if (E.isOdd()) {
                const z = 2 - E.mod(4).toJSNumber();
                res.push( z );
                E = E.minus(z);
            } else {
                res.push( 0 );
            }
            E = E.shiftRight(1);
        }
        return res;
    }

    function bits$1(n) {
        let E = BigInteger(n);
        const res = [];
        while (E.gt(BigInteger.zero)) {
            if (E.isOdd()) {
                res.push(1);
            } else {
                res.push( 0 );
            }
            E = E.shiftRight(1);
        }
        return res;
    }

    function toNumber$1(s) {
        if (!s.lt(BigInteger("9007199254740992", 10))) {
            throw new Error("Number too big");
        }
        return s.toJSNumber();
    }

    function toArray$1(s, radix) {
        return BigInteger(s).toArray(radix);
    }

    function add$1(a, b) {
        return BigInteger(a).add(BigInteger(b));
    }

    function sub$1(a, b) {
        return BigInteger(a).minus(BigInteger(b));
    }

    function neg$1(a) {
        return BigInteger.zero.minus(BigInteger(a));
    }

    function mul$1(a, b) {
        return BigInteger(a).times(BigInteger(b));
    }

    function square$1(a) {
        return BigInteger(a).square();
    }

    function pow$1(a, b) {
        return BigInteger(a).pow(BigInteger(b));
    }

    function exp$1(a, b) {
        return BigInteger(a).pow(BigInteger(b));
    }

    function abs$1(a) {
        return BigInteger(a).abs();
    }

    function div$1(a, b) {
        return BigInteger(a).divide(BigInteger(b));
    }

    function mod$1(a, b) {
        return BigInteger(a).mod(BigInteger(b));
    }

    function eq$1(a, b) {
        return BigInteger(a).eq(BigInteger(b));
    }

    function neq$1(a, b) {
        return BigInteger(a).neq(BigInteger(b));
    }

    function lt$1(a, b) {
        return BigInteger(a).lt(BigInteger(b));
    }

    function gt$1(a, b) {
        return BigInteger(a).gt(BigInteger(b));
    }

    function leq$1(a, b) {
        return BigInteger(a).leq(BigInteger(b));
    }

    function geq$1(a, b) {
        return BigInteger(a).geq(BigInteger(b));
    }

    function band$1(a, b) {
        return BigInteger(a).and(BigInteger(b));
    }

    function bor$1(a, b) {
        return BigInteger(a).or(BigInteger(b));
    }

    function bxor$1(a, b) {
        return BigInteger(a).xor(BigInteger(b));
    }

    function land$1(a, b) {
        return (!BigInteger(a).isZero()) && (!BigInteger(b).isZero());
    }

    function lor$1(a, b) {
        return (!BigInteger(a).isZero()) || (!BigInteger(b).isZero());
    }

    function lnot$1(a) {
        return BigInteger(a).isZero();
    }

    var Scalar_bigint = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fromString: fromString$1,
        e: e$1,
        fromArray: fromArray$1,
        bitLength: bitLength$1,
        isNegative: isNegative$1,
        isZero: isZero$1,
        shiftLeft: shiftLeft$1,
        shiftRight: shiftRight$1,
        shl: shl$1,
        shr: shr$1,
        isOdd: isOdd$1,
        naf: naf$1,
        bits: bits$1,
        toNumber: toNumber$1,
        toArray: toArray$1,
        add: add$1,
        sub: sub$1,
        neg: neg$1,
        mul: mul$1,
        square: square$1,
        pow: pow$1,
        exp: exp$1,
        abs: abs$1,
        div: div$1,
        mod: mod$1,
        eq: eq$1,
        neq: neq$1,
        lt: lt$1,
        gt: gt$1,
        leq: leq$1,
        geq: geq$1,
        band: band$1,
        bor: bor$1,
        bxor: bxor$1,
        land: land$1,
        lor: lor$1,
        lnot: lnot$1
    });

    const supportsNativeBigInt = typeof BigInt === "function";

    let Scalar = {};
    if (supportsNativeBigInt) {
        Object.assign(Scalar, Scalar_native);
    } else {
        Object.assign(Scalar, Scalar_bigint);
    }


    // Returns a buffer with Little Endian Representation
    Scalar.toRprLE = function rprBE(buff, o, e, n8) {
        const s = "0000000" + e.toString(16);
        const v = new Uint32Array(buff.buffer, o, n8/4);
        const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
        for (let i=0; i<l; i++) v[i] = parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16);
        for (let i=l; i<v.length; i++) v[i] = 0;
        for (let i=v.length*4; i<n8; i++) buff[i] = Scalar.toNumber(Scalar.band(Scalar.shiftRight(e, i*8), 0xFF));
    };

    // Returns a buffer with Big Endian Representation
    Scalar.toRprBE = function rprLEM(buff, o, e, n8) {
        const s = "0000000" + e.toString(16);
        const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
        const l = (((s.length-7)*4 - 1) >> 5)+1;    // Number of 32bit words;
        for (let i=0; i<l; i++) v.setUint32(n8-i*4 -4, parseInt(s.substring(s.length-8*i-8, s.length-8*i), 16), false);
        for (let i=0; i<n8/4-l; i++) v[i] = 0;
    };

    // Pases a buffer with Little Endian Representation
    Scalar.fromRprLE = function rprLEM(buff, o, n8) {
        n8 = n8 || buff.byteLength;
        const v = new Uint32Array(buff.buffer, o, n8/4);
        const a = new Array(n8/4);
        v.forEach( (ch,i) => a[a.length-i-1] = ch.toString(16).padStart(8,"0") );
        return Scalar.fromString(a.join(""), 16);
    };

    // Pases a buffer with Big Endian Representation
    Scalar.fromRprBE = function rprLEM(buff, o, n8) {
        n8 = n8 || buff.byteLength;
        const v = new DataView(buff.buffer, buff.byteOffset + o, n8);
        const a = new Array(n8/4);
        for (let i=0; i<n8/4; i++) {
            a[i] = v.getUint32(i*4, false).toString(16).padStart(8, "0");
        }
        return Scalar.fromString(a.join(""), 16);
    };

    Scalar.toString = function toString(a, radix) {
        return a.toString(radix);
    };

    Scalar.toLEBuff = function toLEBuff(a) {
        const buff = new Uint8Array(Math.floor((Scalar.bitLength(a) - 1) / 8) +1);
        Scalar.toRprLE(buff, 0, a, buff.byteLength);
        return buff;
    };


    Scalar.zero = Scalar.e(0);
    Scalar.one = Scalar.e(1);

    let {
        toRprLE,
        toRprBE,
        fromRprLE,
        fromRprBE,
        toString,
        toLEBuff,
        zero,
        one,
        fromString: fromString$2,
        e: e$2,
        fromArray: fromArray$2,
        bitLength: bitLength$2,
        isNegative: isNegative$2,
        isZero: isZero$2,
        shiftLeft: shiftLeft$2,
        shiftRight: shiftRight$2,
        shl: shl$2,
        shr: shr$2,
        isOdd: isOdd$2,
        naf: naf$2,
        bits: bits$2,
        toNumber: toNumber$2,
        toArray: toArray$2,
        add: add$2,
        sub: sub$2,
        neg: neg$2,
        mul: mul$2,
        square: square$2,
        pow: pow$2,
        exp: exp$2,
        abs: abs$2,
        div: div$2,
        mod: mod$2,
        eq: eq$2,
        neq: neq$2,
        lt: lt$2,
        gt: gt$2,
        leq: leq$2,
        geq: geq$2,
        band: band$2,
        bor: bor$2,
        bxor: bxor$2,
        land: land$2,
        lor: lor$2,
        lnot: lnot$2,
    } = Scalar;

    var _Scalar = /*#__PURE__*/Object.freeze({
        __proto__: null,
        toRprLE: toRprLE,
        toRprBE: toRprBE,
        fromRprLE: fromRprLE,
        fromRprBE: fromRprBE,
        toString: toString,
        toLEBuff: toLEBuff,
        zero: zero,
        one: one,
        fromString: fromString$2,
        e: e$2,
        fromArray: fromArray$2,
        bitLength: bitLength$2,
        isNegative: isNegative$2,
        isZero: isZero$2,
        shiftLeft: shiftLeft$2,
        shiftRight: shiftRight$2,
        shl: shl$2,
        shr: shr$2,
        isOdd: isOdd$2,
        naf: naf$2,
        bits: bits$2,
        toNumber: toNumber$2,
        toArray: toArray$2,
        add: add$2,
        sub: sub$2,
        neg: neg$2,
        mul: mul$2,
        square: square$2,
        pow: pow$2,
        exp: exp$2,
        abs: abs$2,
        div: div$2,
        mod: mod$2,
        eq: eq$2,
        neq: neq$2,
        lt: lt$2,
        gt: gt$2,
        leq: leq$2,
        geq: geq$2,
        band: band$2,
        bor: bor$2,
        bxor: bxor$2,
        land: land$2,
        lor: lor$2,
        lnot: lnot$2
    });

    /*
        Copyright 2018 0kims association.

        This file is part of snarkjs.

        snarkjs is a free software: you can redistribute it and/or
        modify it under the terms of the GNU General Public License as published by the
        Free Software Foundation, either version 3 of the License, or (at your option)
        any later version.

        snarkjs is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
        or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
        more details.

        You should have received a copy of the GNU General Public License along with
        snarkjs. If not, see <https://www.gnu.org/licenses/>.
    */

    const _revTable = [];
    for (let i=0; i<256; i++) {
        _revTable[i] = _revSlow(i, 8);
    }

    function _revSlow(idx, bits) {
        let res =0;
        let a = idx;
        for (let i=0; i<bits; i++) {
            res <<= 1;
            res = res | (a &1);
            a >>=1;
        }
        return res;
    }

    /*
        Copyright 2018 0kims association.

        This file is part of snarkjs.

        snarkjs is a free software: you can redistribute it and/or
        modify it under the terms of the GNU General Public License as published by the
        Free Software Foundation, either version 3 of the License, or (at your option)
        any later version.

        snarkjs is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
        or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
        more details.

        You should have received a copy of the GNU General Public License along with
        snarkjs. If not, see <https://www.gnu.org/licenses/>.
    */


    /*
    exports.mulScalar = (F, base, e) =>{
        let res = F.zero;
        let rem = bigInt(e);
        let exp = base;

        while (! rem.eq(bigInt.zero)) {
            if (rem.and(bigInt.one).eq(bigInt.one)) {
                res = F.add(res, exp);
            }
            exp = F.double(exp);
            rem = rem.shiftRight(1);
        }

        return res;
    };
    */


    function exp$3(F, base, e) {

        if (isZero$2(e)) return F.one;

        const n = bits$2(e);

        if (n.legth==0) return F.one;

        let res = base;

        for (let i=n.length-2; i>=0; i--) {

            res = F.square(res);

            if (n[i]) {
                res = F.mul(res, base);
            }
        }

        return res;
    }

    // Check here: https://eprint.iacr.org/2012/685.pdf

    function buildSqrt (F) {
        if ((F.m % 2) == 1) {
            if (eq$2(mod$2(F.p, 4), 1 )) {
                if (eq$2(mod$2(F.p, 8), 1 )) {
                    if (eq$2(mod$2(F.p, 16), 1 )) {
                        // alg7_muller(F);
                        alg5_tonelliShanks(F);
                    } else if (eq$2(mod$2(F.p, 16), 9 )) {
                        alg4_kong(F);
                    } else {
                        throw new Error("Field withot sqrt");
                    }
                } else if (eq$2(mod$2(F.p, 8), 5 )) {
                    alg3_atkin(F);
                } else {
                    throw new Error("Field withot sqrt");
                }
            } else if (eq$2(mod$2(F.p, 4), 3 )) {
                alg2_shanks(F);
            }
        } else {
            const pm2mod4 = mod$2(pow$2(F.p, F.m/2), 4);
            if (pm2mod4 == 1) {
                alg10_adj(F);
            } else if (pm2mod4 == 3) {
                alg9_adj(F);
            } else {
                alg8_complex(F);
            }

        }
    }


    function alg5_tonelliShanks(F) {
        F.sqrt_q = pow$2(F.p, F.m);

        F.sqrt_s = 0;
        F.sqrt_t = sub$2(F.sqrt_q, 1);

        while (!isOdd$2(F.sqrt_t)) {
            F.sqrt_s = F.sqrt_s + 1;
            F.sqrt_t = div$2(F.sqrt_t, 2);
        }

        let c0 = F.one;

        while (F.eq(c0, F.one)) {
            const c = F.random();
            F.sqrt_z = F.pow(c, F.sqrt_t);
            c0 = F.pow(F.sqrt_z, 2 ** (F.sqrt_s-1) );
        }

        F.sqrt_tm1d2 = div$2(sub$2(F.sqrt_t, 1),2);

        F.sqrt = function(a) {
            const F=this;
            if (F.isZero(a)) return F.zero;
            let w = F.pow(a, F.sqrt_tm1d2);
            const a0 = F.pow( F.mul(F.square(w), a), 2 ** (F.sqrt_s-1) );
            if (F.eq(a0, F.negone)) return null;

            let v = F.sqrt_s;
            let x = F.mul(a, w);
            let b = F.mul(x, w);
            let z = F.sqrt_z;
            while (!F.eq(b, F.one)) {
                let b2k = F.square(b);
                let k=1;
                while (!F.eq(b2k, F.one)) {
                    b2k = F.square(b2k);
                    k++;
                }

                w = z;
                for (let i=0; i<v-k-1; i++) {
                    w = F.square(w);
                }
                z = F.square(w);
                b = F.mul(b, z);
                x = F.mul(x, w);
                v = k;
            }
            return F.geq(x, F.zero) ? x : F.neg(x);
        };
    }

    function alg4_kong(F) {
        F.sqrt = function() {
            throw new Error("Sqrt alg 4 not implemented");
        };
    }

    function alg3_atkin(F) {
        F.sqrt = function() {
            throw new Error("Sqrt alg 3 not implemented");
        };
    }

    function alg2_shanks(F) {

        F.sqrt_q = pow$2(F.p, F.m);
        F.sqrt_e1 = div$2( sub$2(F.sqrt_q, 3) , 4);

        F.sqrt = function(a) {
            if (this.isZero(a)) return this.zero;

            // Test that have solution
            const a1 = this.pow(a, this.sqrt_e1);

            const a0 = this.mul(this.square(a1), a);

            if ( this.eq(a0, this.negone) ) return null;

            const x = this.mul(a1, a);

            return F.geq(x, F.zero) ? x : F.neg(x);
        };
    }

    function alg10_adj(F) {
        F.sqrt = function() {
            throw new Error("Sqrt alg 10 not implemented");
        };
    }

    function alg9_adj(F) {
        F.sqrt_q = pow$2(F.p, F.m/2);
        F.sqrt_e34 = div$2( sub$2(F.sqrt_q, 3) , 4);
        F.sqrt_e12 = div$2( sub$2(F.sqrt_q, 1) , 2);

        F.frobenius = function(n, x) {
            if ((n%2) == 1) {
                return F.conjugate(x);
            } else {
                return x;
            }
        };

        F.sqrt = function(a) {
            const F = this;
            const a1 = F.pow(a, F.sqrt_e34);
            const alfa = F.mul(F.square(a1), a);
            const a0 = F.mul(F.frobenius(1, alfa), alfa);
            if (F.eq(a0, F.negone)) return null;
            const x0 = F.mul(a1, a);
            let x;
            if (F.eq(alfa, F.negone)) {
                x = F.mul(x0, [F.F.zero, F.F.one]);
            } else {
                const b = F.pow(F.add(F.one, alfa), F.sqrt_e12);
                x = F.mul(b, x0);
            }
            return F.geq(x, F.zero) ? x : F.neg(x);
        };
    }


    function alg8_complex(F) {
        F.sqrt = function() {
            throw new Error("Sqrt alg 8 not implemented");
        };
    }

    function quarterRound(st, a, b, c, d) {

        st[a] = (st[a] + st[b]) >>> 0;
        st[d] = (st[d] ^ st[a]) >>> 0;
        st[d] = ((st[d] << 16) | ((st[d]>>>16) & 0xFFFF)) >>> 0;

        st[c] = (st[c] + st[d]) >>> 0;
        st[b] = (st[b] ^ st[c]) >>> 0;
        st[b] = ((st[b] << 12) | ((st[b]>>>20) & 0xFFF)) >>> 0;

        st[a] = (st[a] + st[b]) >>> 0;
        st[d] = (st[d] ^ st[a]) >>> 0;
        st[d] = ((st[d] << 8) | ((st[d]>>>24) & 0xFF)) >>> 0;

        st[c] = (st[c] + st[d]) >>> 0;
        st[b] = (st[b] ^ st[c]) >>> 0;
        st[b] = ((st[b] << 7) | ((st[b]>>>25) & 0x7F)) >>> 0;
    }

    function doubleRound(st) {
        quarterRound(st, 0, 4, 8,12);
        quarterRound(st, 1, 5, 9,13);
        quarterRound(st, 2, 6,10,14);
        quarterRound(st, 3, 7,11,15);

        quarterRound(st, 0, 5,10,15);
        quarterRound(st, 1, 6,11,12);
        quarterRound(st, 2, 7, 8,13);
        quarterRound(st, 3, 4, 9,14);
    }

    class ChaCha {

        constructor(seed) {
            seed = seed || [0,0,0,0,0,0,0,0];
            this.state = [
                0x61707865,
                0x3320646E,
                0x79622D32,
                0x6B206574,
                seed[0],
                seed[1],
                seed[2],
                seed[3],
                seed[4],
                seed[5],
                seed[6],
                seed[7],
                0,
                0,
                0,
                0
            ];
            this.idx = 16;
            this.buff = new Array(16);
        }

        nextU32() {
            if (this.idx == 16) this.update();
            return this.buff[this.idx++];
        }

        nextU64() {
            return add$2(mul$2(this.nextU32(), 0x100000000), this.nextU32());
        }

        nextBool() {
            return (this.nextU32() & 1) == 1;
        }

        update() {
            // Copy the state
            for (let i=0; i<16; i++) this.buff[i] = this.state[i];

            // Apply the rounds
            for (let i=0; i<10; i++) doubleRound(this.buff);

            // Add to the initial
            for (let i=0; i<16; i++) this.buff[i] = (this.buff[i] + this.state[i]) >>> 0;

            this.idx = 0;

            this.state[12] = (this.state[12] + 1) >>> 0;
            if (this.state[12] != 0) return;
            this.state[13] = (this.state[13] + 1) >>> 0;
            if (this.state[13] != 0) return;
            this.state[14] = (this.state[14] + 1) >>> 0;
            if (this.state[14] != 0) return;
            this.state[15] = (this.state[15] + 1) >>> 0;
        }
    }

    var crypto = {};

    /* global window */

    function getRandomBytes(n) {
        let array = new Uint8Array(n);
        if (typeof window !== "undefined") { // Browser
            if (typeof window.crypto !== "undefined") { // Supported
                window.crypto.getRandomValues(array);
            } else { // fallback
                for (let i=0; i<n; i++) {
                    array[i] = (Math.random()*4294967296)>>>0;
                }
            }
        }
        else { // NodeJS
            crypto.randomFillSync(array);
        }
        return array;
    }

    function getRandomSeed() {
        const arr = getRandomBytes(32);
        const arrV = new Uint32Array(arr.buffer);
        const seed = [];
        for (let i=0; i<8; i++) {
            seed.push(arrV[i]);
        }
        return seed;
    }

    let threadRng = null;

    function getThreadRng() {
        if (threadRng) return threadRng;
        threadRng = new ChaCha(getRandomSeed());
        return threadRng;
    }

    /* global BigInt */

    class ZqField {
        constructor(p) {
            this.type="F1";
            this.one = 1n;
            this.zero = 0n;
            this.p = BigInt(p);
            this.m = 1;
            this.negone = this.p-1n;
            this.two = 2n;
            this.half = this.p >> 1n;
            this.bitLength = bitLength$2(this.p);
            this.mask = (1n << BigInt(this.bitLength)) - 1n;

            this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
            this.n32 = this.n64*2;
            this.n8 = this.n64*8;
            this.R = this.e(1n << BigInt(this.n64*64));
            this.Ri = this.inv(this.R);

            const e = this.negone >> 1n;
            this.nqr = this.two;
            let r = this.pow(this.nqr, e);
            while (!this.eq(r, this.negone)) {
                this.nqr = this.nqr + 1n;
                r = this.pow(this.nqr, e);
            }


            this.s = 0;
            this.t = this.negone;

            while ((this.t & 1n) == 0n) {
                this.s = this.s + 1;
                this.t = this.t >> 1n;
            }

            this.nqr_to_t = this.pow(this.nqr, this.t);

            buildSqrt(this);
        }

        e(a,b) {
            let res;
            if (!b) {
                res = BigInt(a);
            } else if (b==16) {
                res = BigInt("0x"+a);
            }
            if (res < 0) {
                let nres = -res;
                if (nres >= this.p) nres = nres % this.p;
                return this.p - nres;
            } else {
                return (res>= this.p) ? res%this.p : res;
            }

        }

        add(a, b) {
            const res = a + b;
            return res >= this.p ? res-this.p : res;
        }

        sub(a, b) {
            return (a >= b) ? a-b : this.p-b+a;
        }

        neg(a) {
            return a ? this.p-a : a;
        }

        mul(a, b) {
            return (a*b)%this.p;
        }

        mulScalar(base, s) {
            return (base * this.e(s)) % this.p;
        }

        square(a) {
            return (a*a) % this.p;
        }

        eq(a, b) {
            return a==b;
        }

        neq(a, b) {
            return a!=b;
        }

        lt(a, b) {
            const aa = (a > this.half) ? a - this.p : a;
            const bb = (b > this.half) ? b - this.p : b;
            return aa < bb;
        }

        gt(a, b) {
            const aa = (a > this.half) ? a - this.p : a;
            const bb = (b > this.half) ? b - this.p : b;
            return aa > bb;
        }

        leq(a, b) {
            const aa = (a > this.half) ? a - this.p : a;
            const bb = (b > this.half) ? b - this.p : b;
            return aa <= bb;
        }

        geq(a, b) {
            const aa = (a > this.half) ? a - this.p : a;
            const bb = (b > this.half) ? b - this.p : b;
            return aa >= bb;
        }

        div(a, b) {
            return this.mul(a, this.inv(b));
        }

        idiv(a, b) {
            if (!b) throw new Error("Division by zero");
            return a / b;
        }

        inv(a) {
            if (!a) throw new Error("Division by zero");

            let t = 0n;
            let r = this.p;
            let newt = 1n;
            let newr = a % this.p;
            while (newr) {
                let q = r/newr;
                [t, newt] = [newt, t-q*newt];
                [r, newr] = [newr, r-q*newr];
            }
            if (t<0n) t += this.p;
            return t;
        }

        mod(a, b) {
            return a % b;
        }

        pow(b, e) {
            return exp$3(this, b, e);
        }

        exp(b, e) {
            return exp$3(this, b, e);
        }

        band(a, b) {
            const res =  ((a & b) & this.mask);
            return res >= this.p ? res-this.p : res;
        }

        bor(a, b) {
            const res =  ((a | b) & this.mask);
            return res >= this.p ? res-this.p : res;
        }

        bxor(a, b) {
            const res =  ((a ^ b) & this.mask);
            return res >= this.p ? res-this.p : res;
        }

        bnot(a) {
            const res = a ^ this.mask;
            return res >= this.p ? res-this.p : res;
        }

        shl(a, b) {
            if (Number(b) < this.bitLength) {
                const res = (a << b) & this.mask;
                return res >= this.p ? res-this.p : res;
            } else {
                const nb = this.p - b;
                if (Number(nb) < this.bitLength) {
                    return a >> nb;
                } else {
                    return 0n;
                }
            }
        }

        shr(a, b) {
            if (Number(b) < this.bitLength) {
                return a >> b;
            } else {
                const nb = this.p - b;
                if (Number(nb) < this.bitLength) {
                    const res = (a << nb) & this.mask;
                    return res >= this.p ? res-this.p : res;
                } else {
                    return 0;
                }
            }
        }

        land(a, b) {
            return (a && b) ? 1n : 0n;
        }

        lor(a, b) {
            return (a || b) ? 1n : 0n;
        }

        lnot(a) {
            return (a) ? 0n : 1n;
        }

        sqrt_old(n) {

            if (n == 0n) return this.zero;

            // Test that have solution
            const res = this.pow(n, this.negone >> this.one);
            if ( res != 1n ) return null;

            let m = this.s;
            let c = this.nqr_to_t;
            let t = this.pow(n, this.t);
            let r = this.pow(n, this.add(this.t, this.one) >> 1n );

            while ( t != 1n ) {
                let sq = this.square(t);
                let i = 1;
                while (sq != 1n ) {
                    i++;
                    sq = this.square(sq);
                }

                // b = c ^ m-i-1
                let b = c;
                for (let j=0; j< m-i-1; j ++) b = this.square(b);

                m = i;
                c = this.square(b);
                t = this.mul(t, c);
                r = this.mul(r, b);
            }

            if (r > (this.p >> 1n)) {
                r = this.neg(r);
            }

            return r;
        }

        normalize(a, b) {
            a = BigInt(a,b);
            if (a < 0) {
                let na = -a;
                if (na >= this.p) na = na % this.p;
                return this.p - na;
            } else {
                return (a>= this.p) ? a%this.p : a;
            }
        }

        random() {
            const nBytes = (this.bitLength*2 / 8);
            let res =0n;
            for (let i=0; i<nBytes; i++) {
                res = (res << 8n) + BigInt(getRandomBytes(1)[0]);
            }
            return res % this.p;
        }

        toString(a, base) {
            let vs;
            if (a > this.half) {
                const v = this.p-a;
                vs = "-"+v.toString(base);
            } else {
                vs = a.toString(base);
            }
            return vs;
        }

        isZero(a) {
            return a == 0n;
        }

        fromRng(rng) {
            let v;
            do {
                v=0n;
                for (let i=0; i<this.n64; i++) {
                    v += rng.nextU64() << BigInt(64 *i);
                }
                v &= this.mask;
            } while (v >= this.p);
            v = (v * this.Ri) % this.p;   // Convert from montgomery
            return v;
        }

    }

    class ZqField$1 {
        constructor(p) {
            this.type="F1";
            this.one = BigInteger.one;
            this.zero = BigInteger.zero;
            this.p = BigInteger(p);
            this.m = 1;
            this.negone = this.p.minus(BigInteger.one);
            this.two = BigInteger(2);
            this.half = this.p.shiftRight(1);
            this.bitLength = this.p.bitLength();
            this.mask = BigInteger.one.shiftLeft(this.bitLength).minus(BigInteger.one);

            this.n64 = Math.floor((this.bitLength - 1) / 64)+1;
            this.n32 = this.n64*2;
            this.n8 = this.n64*8;
            this.R = BigInteger.one.shiftLeft(this.n64*64);
            this.Ri = this.inv(this.R);

            const e = this.negone.shiftRight(this.one);
            this.nqr = this.two;
            let r = this.pow(this.nqr, e);
            while (!r.equals(this.negone)) {
                this.nqr = this.nqr.add(this.one);
                r = this.pow(this.nqr, e);
            }

            this.s = this.zero;
            this.t = this.negone;

            while (!this.t.isOdd()) {
                this.s = this.s.add(this.one);
                this.t = this.t.shiftRight(this.one);
            }

            this.nqr_to_t = this.pow(this.nqr, this.t);

            buildSqrt(this);
        }

        e(a,b) {

            const res = BigInteger(a,b);

            return this.normalize(res);

        }

        add(a, b) {
            let res = a.add(b);
            if (res.geq(this.p)) {
                res = res.minus(this.p);
            }
            return res;
        }

        sub(a, b) {
            if (a.geq(b)) {
                return a.minus(b);
            } else {
                return this.p.minus(b.minus(a));
            }
        }

        neg(a) {
            if (a.isZero()) return a;
            return this.p.minus(a);
        }

        mul(a, b) {
            return a.times(b).mod(this.p);
        }

        mulScalar(base, s) {
            return base.times(BigInteger(s)).mod(this.p);
        }

        square(a) {
            return a.square().mod(this.p);
        }

        eq(a, b) {
            return a.eq(b);
        }

        neq(a, b) {
            return a.neq(b);
        }

        lt(a, b) {
            const aa = a.gt(this.half) ? a.minus(this.p) : a;
            const bb = b.gt(this.half) ? b.minus(this.p) : b;
            return aa.lt(bb);
        }

        gt(a, b) {
            const aa = a.gt(this.half) ? a.minus(this.p) : a;
            const bb = b.gt(this.half) ? b.minus(this.p) : b;
            return aa.gt(bb);
        }

        leq(a, b) {
            const aa = a.gt(this.half) ? a.minus(this.p) : a;
            const bb = b.gt(this.half) ? b.minus(this.p) : b;
            return aa.leq(bb);
        }

        geq(a, b) {
            const aa = a.gt(this.half) ? a.minus(this.p) : a;
            const bb = b.gt(this.half) ? b.minus(this.p) : b;
            return aa.geq(bb);
        }

        div(a, b) {
            if (b.isZero()) throw new Error("Division by zero");
            return a.times(b.modInv(this.p)).mod(this.p);
        }

        idiv(a, b) {
            if (b.isZero()) throw new Error("Division by zero");
            return a.divide(b);
        }

        inv(a) {
            if (a.isZero()) throw new Error("Division by zero");
            return a.modInv(this.p);
        }

        mod(a, b) {
            return a.mod(b);
        }

        pow(a, b) {
            return a.modPow(b, this.p);
        }

        exp(a, b) {
            return a.modPow(b, this.p);
        }

        band(a, b) {
            return a.and(b).and(this.mask).mod(this.p);
        }

        bor(a, b) {
            return a.or(b).and(this.mask).mod(this.p);
        }

        bxor(a, b) {
            return a.xor(b).and(this.mask).mod(this.p);
        }

        bnot(a) {
            return a.xor(this.mask).mod(this.p);
        }

        shl(a, b) {
            if (b.lt(this.bitLength)) {
                return a.shiftLeft(b).and(this.mask).mod(this.p);
            } else {
                const nb = this.p.minus(b);
                if (nb.lt(this.bitLength)) {
                    return this.shr(a, nb);
                } else {
                    return BigInteger.zero;
                }
            }
        }

        shr(a, b) {
            if (b.lt(this.bitLength)) {
                return a.shiftRight(b);
            } else {
                const nb = this.p.minus(b);
                if (nb.lt(this.bitLength)) {
                    return this.shl(a, nb);
                } else {
                    return BigInteger.zero;
                }
            }
        }

        land(a, b) {
            return (a.isZero() || b.isZero()) ? BigInteger.zero : BigInteger.one;
        }

        lor(a, b) {
            return (a.isZero() && b.isZero()) ? BigInteger.zero : BigInteger.one;
        }

        lnot(a) {
            return a.isZero() ? BigInteger.one : BigInteger.zero;
        }

        sqrt_old(n) {

            if (n.equals(this.zero)) return this.zero;

            // Test that have solution
            const res = this.pow(n, this.negone.shiftRight(this.one));
            if (!res.equals(this.one)) return null;

            let m = parseInt(this.s);
            let c = this.nqr_to_t;
            let t = this.pow(n, this.t);
            let r = this.pow(n, this.add(this.t, this.one).shiftRight(this.one) );

            while (!t.equals(this.one)) {
                let sq = this.square(t);
                let i = 1;
                while (!sq.equals(this.one)) {
                    i++;
                    sq = this.square(sq);
                }

                // b = c ^ m-i-1
                let b = c;
                for (let j=0; j< m-i-1; j ++) b = this.square(b);

                m = i;
                c = this.square(b);
                t = this.mul(t, c);
                r = this.mul(r, b);
            }

            if (r.greater(this.p.shiftRight(this.one))) {
                r = this.neg(r);
            }

            return r;
        }

        normalize(a) {
            a = BigInteger(a);
            if (a.isNegative()) {
                return this.p.minus(a.abs().mod(this.p));
            } else {
                return a.mod(this.p);
            }
        }

        random() {
            let res = BigInteger(0);
            let n = BigInteger(this.p.square());
            while (!n.isZero()) {
                res = res.shiftLeft(8).add(BigInteger(getRandomBytes(1)[0]));
                n = n.shiftRight(8);
            }
            return res.mod(this.p);
        }

        toString(a, base) {
            let vs;
            if (!a.lesserOrEquals(this.p.shiftRight(BigInteger(1)))) {
                const v = this.p.minus(a);
                vs = "-"+v.toString(base);
            } else {
                vs = a.toString(base);
            }

            return vs;
        }

        isZero(a) {
            return a.isZero();
        }

        fromRng(rng) {
            let v;
            do {
                v = BigInteger(0);
                for (let i=0; i<this.n64; i++) {
                    v = v.add(v, rng.nextU64().shiftLeft(64*i));
                }
                v = v.and(this.mask);
            } while (v.geq(this.p));
            v = v.times(this.Ri).mod(this.q);
            return v;
        }


    }

    const supportsNativeBigInt$1 = typeof BigInt === "function";
    let _F1Field;
    if (supportsNativeBigInt$1) {
        _F1Field = ZqField;
    } else {
        _F1Field = ZqField$1;
    }

    class F1Field extends _F1Field {

        // Returns a buffer with Little Endian Representation
        toRprLE(buff, o, e) {
            toRprLE(buff, o, e, this.n64*8);
        }

        // Returns a buffer with Big Endian Representation
        toRprBE(buff, o, e) {
            toRprBE(buff, o, e, this.n64*8);
        }

        // Returns a buffer with Big Endian Montgomery Representation
        toRprBEM(buff, o, e) {
            return this.toRprBE(buff, o, this.mul(this.R, e));
        }

        toRprLEM(buff, o, e) {
            return this.toRprLE(buff, o, this.mul(this.R, e));
        }


        // Pases a buffer with Little Endian Representation
        fromRprLE(buff, o) {
            return fromRprLE(buff, o, this.n8);
        }

        // Pases a buffer with Big Endian Representation
        fromRprBE(buff, o) {
            return fromRprBE(buff, o, this.n8);
        }

        fromRprLEM(buff, o) {
            return this.mul(this.fromRprLE(buff, o), this.Ri);
        }

        fromRprBEM(buff, o) {
            return this.mul(this.fromRprBE(buff, o), this.Ri);
        }

    }

    var code = "AGFzbQEAAAABlAESYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgBn9/f39/fwBgCn9/f39/f39/f38AYAV/f39/fwF/YAd/f39/f39/AX9gCX9/f39/f39/fwF/YAt/f39/f39/f39/fwF/Ag8BA2VudgZtZW1vcnkCABkDuQK3AgABAgEDAwQEBQAABgcIBQIFBQAABQAAAAACAgABBQgJBQUIAAICBQUAAAUAAAAAAgIAAQUICQUFCAACBQAAAgICAQEAAAADAwMAAAUFBQAABQUFAAAAAAACAgUABQAAAAAFBQUFBQoACwkKAAsJCAgDAAgIAgAACQwMBQUMAAgNCQgCAgEBAAUFAAUFAAAAAAMACAICCQgAAgICAQEAAAADAwMAAAUFBQAABQUFAAAAAAACAgUABQAAAAAFBQUFBQoACwkKAAsJCAgFAwAICAIAAAkMDAUFDAUDAAgIAgAACQwMBQUMBQUJCQkJCQACAgEBAAUABQUAAgAAAwAIAgkIAAICAQEABQUABQUAAAAAAwAIAgIJCAACBQAAAAAICAUAAAAAAAAAAAAAAAAAAAAABA4PEBEFB+0kqAIIaW50X2NvcHkAAAhpbnRfemVybwABB2ludF9vbmUAAwppbnRfaXNaZXJvAAIGaW50X2VxAAQHaW50X2d0ZQAFB2ludF9hZGQABgdpbnRfc3ViAAcHaW50X211bAAICmludF9zcXVhcmUACQ1pbnRfc3F1YXJlT2xkAAoHaW50X2RpdgANDmludF9pbnZlcnNlTW9kAA4IZjFtX2NvcHkAAAhmMW1femVybwABCmYxbV9pc1plcm8AAgZmMW1fZXEABAdmMW1fYWRkABAHZjFtX3N1YgARB2YxbV9uZWcAEg5mMW1faXNOZWdhdGl2ZQAZCWYxbV9pc09uZQAPCGYxbV9zaWduABoLZjFtX21SZWR1Y3QAEwdmMW1fbXVsABQKZjFtX3NxdWFyZQAVDWYxbV9zcXVhcmVPbGQAFhJmMW1fZnJvbU1vbnRnb21lcnkAGBBmMW1fdG9Nb250Z29tZXJ5ABcLZjFtX2ludmVyc2UAGwdmMW1fb25lABwIZjFtX2xvYWQAHQ9mMW1fdGltZXNTY2FsYXIAHgdmMW1fZXhwACIQZjFtX2JhdGNoSW52ZXJzZQAfCGYxbV9zcXJ0ACMMZjFtX2lzU3F1YXJlACQVZjFtX2JhdGNoVG9Nb250Z29tZXJ5ACAXZjFtX2JhdGNoRnJvbU1vbnRnb21lcnkAIQhmcm1fY29weQAACGZybV96ZXJvAAEKZnJtX2lzWmVybwACBmZybV9lcQAEB2ZybV9hZGQAJgdmcm1fc3ViACcHZnJtX25lZwAoDmZybV9pc05lZ2F0aXZlAC8JZnJtX2lzT25lACUIZnJtX3NpZ24AMAtmcm1fbVJlZHVjdAApB2ZybV9tdWwAKgpmcm1fc3F1YXJlACsNZnJtX3NxdWFyZU9sZAAsEmZybV9mcm9tTW9udGdvbWVyeQAuEGZybV90b01vbnRnb21lcnkALQtmcm1faW52ZXJzZQAxB2ZybV9vbmUAMghmcm1fbG9hZAAzD2ZybV90aW1lc1NjYWxhcgA0B2ZybV9leHAAOBBmcm1fYmF0Y2hJbnZlcnNlADUIZnJtX3NxcnQAOQxmcm1faXNTcXVhcmUAOhVmcm1fYmF0Y2hUb01vbnRnb21lcnkANhdmcm1fYmF0Y2hGcm9tTW9udGdvbWVyeQA3BmZyX2FkZAAmBmZyX3N1YgAnBmZyX25lZwAoBmZyX211bAA7CWZyX3NxdWFyZQA8CmZyX2ludmVyc2UAPQ1mcl9pc05lZ2F0aXZlAD4HZnJfY29weQAAB2ZyX3plcm8AAQZmcl9vbmUAMglmcl9pc1plcm8AAgVmcl9lcQAEDGcxbV9tdWx0aWV4cABpEmcxbV9tdWx0aWV4cF9jaHVuawBoEmcxbV9tdWx0aWV4cEFmZmluZQBtGGcxbV9tdWx0aWV4cEFmZmluZV9jaHVuawBsCmcxbV9pc1plcm8AQBBnMW1faXNaZXJvQWZmaW5lAD8GZzFtX2VxAEgLZzFtX2VxTWl4ZWQARwxnMW1fZXFBZmZpbmUARghnMW1fY29weQBEDmcxbV9jb3B5QWZmaW5lAEMIZzFtX3plcm8AQg5nMW1femVyb0FmZmluZQBBCmcxbV9kb3VibGUAShBnMW1fZG91YmxlQWZmaW5lAEkHZzFtX2FkZABNDGcxbV9hZGRNaXhlZABMDWcxbV9hZGRBZmZpbmUASwdnMW1fbmVnAE8NZzFtX25lZ0FmZmluZQBOB2cxbV9zdWIAUgxnMW1fc3ViTWl4ZWQAUQ1nMW1fc3ViQWZmaW5lAFASZzFtX2Zyb21Nb250Z29tZXJ5AFQYZzFtX2Zyb21Nb250Z29tZXJ5QWZmaW5lAFMQZzFtX3RvTW9udGdvbWVyeQBWFmcxbV90b01vbnRnb21lcnlBZmZpbmUAVQ9nMW1fdGltZXNTY2FsYXIAbhVnMW1fdGltZXNTY2FsYXJBZmZpbmUAbw1nMW1fbm9ybWFsaXplAFsKZzFtX0xFTXRvVQBdCmcxbV9MRU10b0MAXgpnMW1fVXRvTEVNAF8KZzFtX0N0b0xFTQBgD2cxbV9iYXRjaExFTXRvVQBhD2cxbV9iYXRjaExFTXRvQwBiD2cxbV9iYXRjaFV0b0xFTQBjD2cxbV9iYXRjaEN0b0xFTQBkDGcxbV90b0FmZmluZQBXDmcxbV90b0phY29iaWFuAEURZzFtX2JhdGNoVG9BZmZpbmUAWhNnMW1fYmF0Y2hUb0phY29iaWFuAGULZzFtX2luQ3VydmUAWRFnMW1faW5DdXJ2ZUFmZmluZQBYB2ZybV9mZnQAdQhmcm1faWZmdAB2CmZybV9yYXdmZnQAcwtmcm1fZmZ0Sm9pbgB3DmZybV9mZnRKb2luRXh0AHgRZnJtX2ZmdEpvaW5FeHRJbnYAeQpmcm1fZmZ0TWl4AHoMZnJtX2ZmdEZpbmFsAHsdZnJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24AfAhwb2xfemVybwB9D3BvbF9jb25zdHJ1Y3RMQwB+DHFhcF9idWlsZEFCQwB/C3FhcF9qb2luQUJDAIABDHFhcF9iYXRjaEFkZACBAQpmMm1faXNaZXJvAIIBCWYybV9pc09uZQCDAQhmMm1femVybwCEAQdmMm1fb25lAIUBCGYybV9jb3B5AIYBB2YybV9tdWwAhwEIZjJtX211bDEAiAEKZjJtX3NxdWFyZQCJAQdmMm1fYWRkAIoBB2YybV9zdWIAiwEHZjJtX25lZwCMAQhmMm1fc2lnbgCTAQ1mMm1fY29uanVnYXRlAI0BEmYybV9mcm9tTW9udGdvbWVyeQCPARBmMm1fdG9Nb250Z29tZXJ5AI4BBmYybV9lcQCQAQtmMm1faW52ZXJzZQCRAQdmMm1fZXhwAJYBD2YybV90aW1lc1NjYWxhcgCSARBmMm1fYmF0Y2hJbnZlcnNlAJUBCGYybV9zcXJ0AJcBDGYybV9pc1NxdWFyZQCYAQ5mMm1faXNOZWdhdGl2ZQCUAQxnMm1fbXVsdGlleHAAwwESZzJtX211bHRpZXhwX2NodW5rAMIBEmcybV9tdWx0aWV4cEFmZmluZQDHARhnMm1fbXVsdGlleHBBZmZpbmVfY2h1bmsAxgEKZzJtX2lzWmVybwCaARBnMm1faXNaZXJvQWZmaW5lAJkBBmcybV9lcQCiAQtnMm1fZXFNaXhlZAChAQxnMm1fZXFBZmZpbmUAoAEIZzJtX2NvcHkAngEOZzJtX2NvcHlBZmZpbmUAnQEIZzJtX3plcm8AnAEOZzJtX3plcm9BZmZpbmUAmwEKZzJtX2RvdWJsZQCkARBnMm1fZG91YmxlQWZmaW5lAKMBB2cybV9hZGQApwEMZzJtX2FkZE1peGVkAKYBDWcybV9hZGRBZmZpbmUApQEHZzJtX25lZwCpAQ1nMm1fbmVnQWZmaW5lAKgBB2cybV9zdWIArAEMZzJtX3N1Yk1peGVkAKsBDWcybV9zdWJBZmZpbmUAqgESZzJtX2Zyb21Nb250Z29tZXJ5AK4BGGcybV9mcm9tTW9udGdvbWVyeUFmZmluZQCtARBnMm1fdG9Nb250Z29tZXJ5ALABFmcybV90b01vbnRnb21lcnlBZmZpbmUArwEPZzJtX3RpbWVzU2NhbGFyAMgBFWcybV90aW1lc1NjYWxhckFmZmluZQDJAQ1nMm1fbm9ybWFsaXplALUBCmcybV9MRU10b1UAtwEKZzJtX0xFTXRvQwC4AQpnMm1fVXRvTEVNALkBCmcybV9DdG9MRU0AugEPZzJtX2JhdGNoTEVNdG9VALsBD2cybV9iYXRjaExFTXRvQwC8AQ9nMm1fYmF0Y2hVdG9MRU0AvQEPZzJtX2JhdGNoQ3RvTEVNAL4BDGcybV90b0FmZmluZQCxAQ5nMm1fdG9KYWNvYmlhbgCfARFnMm1fYmF0Y2hUb0FmZmluZQC0ARNnMm1fYmF0Y2hUb0phY29iaWFuAL8BC2cybV9pbkN1cnZlALMBEWcybV9pbkN1cnZlQWZmaW5lALIBC2cxbV90aW1lc0ZyAMoBB2cxbV9mZnQA0AEIZzFtX2lmZnQA0QEKZzFtX3Jhd2ZmdADOAQtnMW1fZmZ0Sm9pbgDSAQ5nMW1fZmZ0Sm9pbkV4dADTARFnMW1fZmZ0Sm9pbkV4dEludgDUAQpnMW1fZmZ0TWl4ANUBDGcxbV9mZnRGaW5hbADWAR1nMW1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgDXAQtnMm1fdGltZXNGcgDYAQdnMm1fZmZ0AN4BCGcybV9pZmZ0AN8BCmcybV9yYXdmZnQA3AELZzJtX2ZmdEpvaW4A4AEOZzJtX2ZmdEpvaW5FeHQA4QERZzJtX2ZmdEpvaW5FeHRJbnYA4gEKZzJtX2ZmdE1peADjAQxnMm1fZmZ0RmluYWwA5AEdZzJtX3ByZXBhcmVMYWdyYW5nZUV2YWx1YXRpb24A5QERZzFtX3RpbWVzRnJBZmZpbmUA5gERZzJtX3RpbWVzRnJBZmZpbmUA5wERZnJtX2JhdGNoQXBwbHlLZXkA6AERZzFtX2JhdGNoQXBwbHlLZXkA6QEWZzFtX2JhdGNoQXBwbHlLZXlNaXhlZADqARFnMm1fYmF0Y2hBcHBseUtleQDrARZnMm1fYmF0Y2hBcHBseUtleU1peGVkAOwBCmY2bV9pc1plcm8A7gEJZjZtX2lzT25lAO8BCGY2bV96ZXJvAPABB2Y2bV9vbmUA8QEIZjZtX2NvcHkA8gEHZjZtX211bADzAQpmNm1fc3F1YXJlAPQBB2Y2bV9hZGQA9QEHZjZtX3N1YgD2AQdmNm1fbmVnAPcBCGY2bV9zaWduAPgBEmY2bV9mcm9tTW9udGdvbWVyeQD6ARBmNm1fdG9Nb250Z29tZXJ5APkBBmY2bV9lcQD7AQtmNm1faW52ZXJzZQD8AQdmNm1fZXhwAIACD2Y2bV90aW1lc1NjYWxhcgD9ARBmNm1fYmF0Y2hJbnZlcnNlAP8BDmY2bV9pc05lZ2F0aXZlAP4BCmZ0bV9pc1plcm8AggIJZnRtX2lzT25lAIMCCGZ0bV96ZXJvAIQCB2Z0bV9vbmUAhQIIZnRtX2NvcHkAhgIHZnRtX211bACHAghmdG1fbXVsMQCIAgpmdG1fc3F1YXJlAIkCB2Z0bV9hZGQAigIHZnRtX3N1YgCLAgdmdG1fbmVnAIwCCGZ0bV9zaWduAJMCDWZ0bV9jb25qdWdhdGUAjQISZnRtX2Zyb21Nb250Z29tZXJ5AI8CEGZ0bV90b01vbnRnb21lcnkAjgIGZnRtX2VxAJACC2Z0bV9pbnZlcnNlAJECB2Z0bV9leHAAlgIPZnRtX3RpbWVzU2NhbGFyAJICEGZ0bV9iYXRjaEludmVyc2UAlQIIZnRtX3NxcnQAlwIMZnRtX2lzU3F1YXJlAJgCDmZ0bV9pc05lZ2F0aXZlAJQCFGJuMTI4X19mcm9iZW5pdXNNYXAwAKECFGJuMTI4X19mcm9iZW5pdXNNYXAxAKICFGJuMTI4X19mcm9iZW5pdXNNYXAyAKMCFGJuMTI4X19mcm9iZW5pdXNNYXAzAKQCFGJuMTI4X19mcm9iZW5pdXNNYXA0AKUCFGJuMTI4X19mcm9iZW5pdXNNYXA1AKYCFGJuMTI4X19mcm9iZW5pdXNNYXA2AKcCFGJuMTI4X19mcm9iZW5pdXNNYXA3AKgCFGJuMTI4X19mcm9iZW5pdXNNYXA4AKkCFGJuMTI4X19mcm9iZW5pdXNNYXA5AKoCEGJuMTI4X3BhaXJpbmdFcTEAsQIQYm4xMjhfcGFpcmluZ0VxMgCyAhBibjEyOF9wYWlyaW5nRXEzALMCEGJuMTI4X3BhaXJpbmdFcTQAtAIQYm4xMjhfcGFpcmluZ0VxNQC1Ag1ibjEyOF9wYWlyaW5nALYCD2JuMTI4X3ByZXBhcmVHMQCbAg9ibjEyOF9wcmVwYXJlRzIAnQIQYm4xMjhfbWlsbGVyTG9vcACgAhlibjEyOF9maW5hbEV4cG9uZW50aWF0aW9uALACHGJuMTI4X2ZpbmFsRXhwb25lbnRpYXRpb25PbGQAqwIPYm4xMjhfX211bEJ5MDI0AJ4CEmJuMTI4X19tdWxCeTAyNE9sZACfAhdibjEyOF9fY3ljbG90b21pY1NxdWFyZQCtAhdibjEyOF9fY3ljbG90b21pY0V4cF93MACuAgrA2wO3AioAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGAseACAAQgA3AwAgAEIANwMIIABCADcDECAAQgA3AxgLMwAgACkDGFAEQCAAKQMQUARAIAApAwhQBEAgACkDAFAPBUEADwsFQQAPCwVBAA8LQQAPCx4AIABCATcDACAAQgA3AwggAEIANwMQIABCADcDGAtHACAAKQMYIAEpAxhRBEAgACkDECABKQMQUQRAIAApAwggASkDCFEEQCAAKQMAIAEpAwBRDwVBAA8LBUEADwsFQQAPC0EADwt9ACAAKQMYIAEpAxhUBEBBAA8FIAApAxggASkDGFYEQEEBDwUgACkDECABKQMQVARAQQAPBSAAKQMQIAEpAxBWBEBBAQ8FIAApAwggASkDCFQEQEEADwUgACkDCCABKQMIVgRAQQEPBSAAKQMAIAEpAwBaDwsLCwsLC0EADwvUAQEBfiAANQIAIAE1AgB8IQMgAiADPgIAIAA1AgQgATUCBHwgA0IgiHwhAyACIAM+AgQgADUCCCABNQIIfCADQiCIfCEDIAIgAz4CCCAANQIMIAE1Agx8IANCIIh8IQMgAiADPgIMIAA1AhAgATUCEHwgA0IgiHwhAyACIAM+AhAgADUCFCABNQIUfCADQiCIfCEDIAIgAz4CFCAANQIYIAE1Ahh8IANCIIh8IQMgAiADPgIYIAA1AhwgATUCHHwgA0IgiHwhAyACIAM+AhwgA0IgiKcLjAIBAX4gADUCACABNQIAfSEDIAIgA0L/////D4M+AgAgADUCBCABNQIEfSADQiCHfCEDIAIgA0L/////D4M+AgQgADUCCCABNQIIfSADQiCHfCEDIAIgA0L/////D4M+AgggADUCDCABNQIMfSADQiCHfCEDIAIgA0L/////D4M+AgwgADUCECABNQIQfSADQiCHfCEDIAIgA0L/////D4M+AhAgADUCFCABNQIUfSADQiCHfCEDIAIgA0L/////D4M+AhQgADUCGCABNQIYfSADQiCHfCEDIAIgA0L/////D4M+AhggADUCHCABNQIcfSADQiCHfCEDIAIgA0L/////D4M+AhwgA0Igh6cLjxASAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+IANC/////w+DIAA1AgAiBSABNQIAIgZ+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIAUgATUCBCIIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIHIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIAUgATUCCCIKfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIJIAZ+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIAUgATUCDCIMfnwhBCADIARCIIh8IQMgBEL/////D4MgByAKfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCILIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIAUgATUCECIOfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECINIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIAUgATUCFCIQfnwhBCADIARCIIh8IQMgBEL/////D4MgByAOfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIPIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DIAUgATUCGCISfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIRIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIARC/////w+DIAUgATUCHCIUfnwhBCADIARCIIh8IQMgBEL/////D4MgByASfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgESAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCITIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DIAcgFH58IQMgBCADQiCIfCEEIANC/////w+DIAkgEn58IQMgBCADQiCIfCEEIANC/////w+DIAsgEH58IQMgBCADQiCIfCEEIANC/////w+DIA0gDn58IQMgBCADQiCIfCEEIANC/////w+DIA8gDH58IQMgBCADQiCIfCEEIANC/////w+DIBEgCn58IQMgBCADQiCIfCEEIANC/////w+DIBMgCH58IQMgBCADQiCIfCEEIAIgAz4CICAEQiCIIQMgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgCyASfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAKfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyALIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyARIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyATIAx+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIARC/////w+DIA0gFH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gEn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgDn58IQQgAyAEQiCIfCEDIAIgBD4CLCADQiCIIQQgA0L/////D4MgDyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESASfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAQfnwhAyAEIANCIIh8IQQgAiADPgIwIARCIIghAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBJ+fCEEIAMgBEIgiHwhAyACIAQ+AjQgA0IgiCEEIANC/////w+DIBMgFH58IQMgBCADQiCIfCEEIAIgAz4COCAEQiCIIQMgAiAEPgI8C4wSDAF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiBiAGfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgQiB358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCCCIIfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIMIgl+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhAiCn58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAggCH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCFCILfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIYIgx+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAJIAl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIYIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhwiDX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAggC358IQIgAyACQiCIfCEDIAJC/////w+DIAkgCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAggDH58IQIgAyACQiCIfCEDIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAggDX58IQIgAyACQiCIfCEDIAJC/////w+DIAkgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAogC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAkgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAogDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAsgC358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DIAsgDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAsgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAwgDH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAwgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjggAyEEIARCIIghBSABIAQ+AjwLCgAgACAAIAEQCAu2AQEBfiAANQAAIAF+IQMgAiADPgAAIAA1AAQgAX4gA0IgiHwhAyACIAM+AAQgADUACCABfiADQiCIfCEDIAIgAz4ACCAANQAMIAF+IANCIIh8IQMgAiADPgAMIAA1ABAgAX4gA0IgiHwhAyACIAM+ABAgADUAFCABfiADQiCIfCEDIAIgAz4AFCAANQAYIAF+IANCIIh8IQMgAiADPgAYIAA1ABwgAX4gA0IgiHwhAyACIAM+ABwLTgIBfgF/IAAhAyADNQAAIAF8IQIgAyACPgAAIAJCIIghAgJAA0AgAlANASADQQRqIQMgAzUAACACfCECIAMgAj4AACACQiCIIQIMAAsLC7ACBwF/AX8BfwF/AX4BfgF/IAIEQCACIQUFQegAIQULIAMEQCADIQQFQYgBIQQLIAAgBBAAIAFByAAQACAFEAFBqAEQAUEfIQZBHyEHAkADQEHIACAH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AhAgBH58IQMgACADPgIsIAA1AjAgA0IgiHxBiAQ1AhQgBH58IQMgACADPgIwIAA1AjQgA0IgiHxBiAQ1AhggBH58IQMgACADPgI0IAA1AjggA0IgiHxBiAQ1AhwgBH58IQMgACADPgI4QegGIANCIIg+AhxB6AYgAEEgaiABEBALvh8jAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkKJx5mkDiEFIANC/////w+DIAA1AgAiBiABNQIAIgd+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhCCADQv////8Pg0EANQKIBCIJIAh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIEIgt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgogB358IQQgAyAEQiCIfCEDIARC/////w+DQQA1AowEIg0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEMIARC/////w+DIAkgDH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AggiD358IQMgBCADQiCIfCEEIANC/////w+DIAogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AggiDiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCkAQiESAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRAgA0L/////D4MgCSAQfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCDCITfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgDiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCISIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKUBCIVIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhFCAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIQIhd+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIhYgB358IQMgBCADQiCIfCEEIANC/////w+DIA0gFH58IQMgBCADQiCIfCEEIANC/////w+DIBEgEH58IQMgBCADQiCIfCEEIANC/////w+DIBUgDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1ApgEIhkgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEYIANC/////w+DIAkgGH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhQiG358IQQgAyAEQiCIfCEDIARC/////w+DIAogF358IQQgAyAEQiCIfCEDIARC/////w+DIA4gE358IQQgAyAEQiCIfCEDIARC/////w+DIBIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBYgC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhQiGiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgESAUfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCnAQiHSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRwgBEL/////D4MgCSAcfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCGCIffnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIeIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKgBCIhIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhICADQv////8PgyAJICB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIcIiN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIiIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gIH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gEH58IQQgAyAEQiCIfCEDIARC/////w+DICEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AqQEIiUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEkIARC/////w+DIAkgJH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAKICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyANICR+fCEDIAQgA0IgiHwhBCADQv////8PgyARICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIAx+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIA4gI358IQQgAyAEQiCIfCEDIARC/////w+DIBIgH358IQQgAyAEQiCIfCEDIARC/////w+DIBYgG358IQQgAyAEQiCIfCEDIARC/////w+DIBogF358IQQgAyAEQiCIfCEDIARC/////w+DIB4gE358IQQgAyAEQiCIfCEDIARC/////w+DICIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgIH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gGH58IQQgAyAEQiCIfCEDIARC/////w+DICEgFH58IQQgAyAEQiCIfCEDIARC/////w+DICUgEH58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgEiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgGiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAUfnwhAyAEIANCIIh8IQQgAiADPgIIIARCIIghAyAEQv////8PgyAWICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBh+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIBogI358IQMgBCADQiCIfCEEIANC/////w+DIB4gH358IQMgBCADQiCIfCEEIANC/////w+DICIgG358IQMgBCADQiCIfCEEIANC/////w+DIB0gJH58IQMgBCADQiCIfCEEIANC/////w+DICEgIH58IQMgBCADQiCIfCEEIANC/////w+DICUgHH58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgHiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAffnwhBCADIARCIIh8IQMgBEL/////D4MgISAkfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAgfnwhBCADIARCIIh8IQMgAiAEPgIUIANCIIghBCADQv////8PgyAiICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICR+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIAIgBD4CHCADpwRAIAJBiAQgAhAHGgUgAkGIBBAFBEAgAkGIBCACEAcaCwsLuyEdAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkKJx5mkDiEGQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCCACQv////8Pg0EANQKIBCIJIAh+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIEIgp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4NBADUCjAQiDCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQsgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCCCINfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApAEIg8gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEOIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgwiEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAPIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKUBCISIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhESACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIQIhN+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCmAQiFSAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRQgAkL/////D4MgCSAUfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCFCIWfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiATfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgFH58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApwEIhggCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEXIAJC/////w+DIAkgF358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhgiGX58IQIgAyACQiCIfCEDIAJC/////w+DIAogFn58IQIgAyACQiCIfCEDIAJC/////w+DIA0gE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBR+fCECIAMgAkIgiHwhAyACQv////8PgyASIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAVIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAYIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKgBCIbIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhGiACQv////8PgyAJIBp+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIcIhx+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBl+fCECIAMgAkIgiHwhAyACQv////8PgyANIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCpAQiHiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIR0gAkL/////D4MgCSAdfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogHH58IQIgAyACQiCIfCEDIAJC/////w+DIA0gGX58IQIgAyACQiCIfCEDIAJC/////w+DIBAgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBMgE358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBp+fCECIAMgAkIgiHwhAyACQv////8PgyASIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAbIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAeIAt+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA0gHH58IQIgAyACQiCIfCEDIAJC/////w+DIBAgGX58IQIgAyACQiCIfCEDIAJC/////w+DIBMgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAPIB1+fCECIAMgAkIgiHwhAyACQv////8PgyASIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAeIA5+fCECIAMgAkIgiHwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBAgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBMgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBYgFn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyASIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBF+fCECIAMgAkIgiHwhAyABIAI+AgggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBMgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBYgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAVIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBR+fCECIAMgAkIgiHwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBYgHH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBkgGX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAYIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBd+fCECIAMgAkIgiHwhAyABIAI+AhAgAyEEIARCIIghBUIAIQJCACED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AgAgBH58IQMgACADPgIAIAA1AgQgA0IgiHxByA41AgQgBH58IQMgACADPgIEIAA1AgggA0IgiHxByA41AgggBH58IQMgACADPgIIIAA1AgwgA0IgiHxByA41AgwgBH58IQMgACADPgIMIAA1AhAgA0IgiHxByA41AhAgBH58IQMgACADPgIQIAA1AhQgA0IgiHxByA41AhQgBH58IQMgACADPgIUIAA1AhggA0IgiHxByA41AhggBH58IQMgACADPgIYIAA1AhwgA0IgiHxByA41AhwgBH58IQMgACADPgIcQagRIANCIIg+AgBCACEDIAA1AgQgAn5C/////w+DIQQgADUCBCADQiCIfEHIDjUCACAEfnwhAyAAIAM+AgQgADUCCCADQiCIfEHIDjUCBCAEfnwhAyAAIAM+AgggADUCDCADQiCIfEHIDjUCCCAEfnwhAyAAIAM+AgwgADUCECADQiCIfEHIDjUCDCAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEHIDjUCECAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AiBBqBEgA0IgiD4CBEIAIQMgADUCCCACfkL/////D4MhBCAANQIIIANCIIh8QcgONQIAIAR+fCEDIAAgAz4CCCAANQIMIANCIIh8QcgONQIEIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QcgONQIIIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QcgONQIMIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QcgONQIQIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QcgONQIUIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgONQIYIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgONQIcIAR+fCEDIAAgAz4CJEGoESADQiCIPgIIQgAhAyAANQIMIAJ+Qv////8PgyEEIAA1AgwgA0IgiHxByA41AgAgBH58IQMgACADPgIMIAA1AhAgA0IgiHxByA41AgQgBH58IQMgACADPgIQIAA1AhQgA0IgiHxByA41AgggBH58IQMgACADPgIUIAA1AhggA0IgiHxByA41AgwgBH58IQMgACADPgIYIAA1AhwgA0IgiHxByA41AhAgBH58IQMgACADPgIcIAA1AiAgA0IgiHxByA41AhQgBH58IQMgACADPgIgIAA1AiQgA0IgiHxByA41AhggBH58IQMgACADPgIkIAA1AiggA0IgiHxByA41AhwgBH58IQMgACADPgIoQagRIANCIIg+AgxCACEDIAA1AhAgAn5C/////w+DIQQgADUCECADQiCIfEHIDjUCACAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEHIDjUCBCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEHIDjUCCCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEHIDjUCDCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIDjUCECAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AixBqBEgA0IgiD4CEEIAIQMgADUCFCACfkL/////D4MhBCAANQIUIANCIIh8QcgONQIAIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QcgONQIEIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QcgONQIIIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QcgONQIMIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QcgONQIQIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QcgONQIUIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QcgONQIYIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QcgONQIcIAR+fCEDIAAgAz4CMEGoESADQiCIPgIUQgAhAyAANQIYIAJ+Qv////8PgyEEIAA1AhggA0IgiHxByA41AgAgBH58IQMgACADPgIYIAA1AhwgA0IgiHxByA41AgQgBH58IQMgACADPgIcIAA1AiAgA0IgiHxByA41AgggBH58IQMgACADPgIgIAA1AiQgA0IgiHxByA41AgwgBH58IQMgACADPgIkIAA1AiggA0IgiHxByA41AhAgBH58IQMgACADPgIoIAA1AiwgA0IgiHxByA41AhQgBH58IQMgACADPgIsIAA1AjAgA0IgiHxByA41AhggBH58IQMgACADPgIwIAA1AjQgA0IgiHxByA41AhwgBH58IQMgACADPgI0QagRIANCIIg+AhhCACEDIAA1AhwgAn5C/////w+DIQQgADUCHCADQiCIfEHIDjUCACAEfnwhAyAAIAM+AhwgADUCICADQiCIfEHIDjUCBCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEHIDjUCCCAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEHIDjUCDCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEHIDjUCECAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEHIDjUCFCAEfnwhAyAAIAM+AjAgADUCNCADQiCIfEHIDjUCGCAEfnwhAyAAIAM+AjQgADUCOCADQiCIfEHIDjUCHCAEfnwhAyAAIAM+AjhBqBEgA0IgiD4CHEGoESAAQSBqIAEQJgu+HyMBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv////8OIQUgA0L/////D4MgADUCACIGIAE1AgAiB358IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEIIANC/////w+DQQA1AsgOIgkgCH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AgQiC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AgQiCiAHfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCzA4iDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIQwgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCCCIPfnwhAyAEIANCIIh8IQQgA0L/////D4MgCiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIOIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLQDiIRIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhECADQv////8PgyAJIBB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIMIhN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIMIhIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gEH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AtQOIhUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEUIARC/////w+DIAkgFH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AhAiF358IQMgBCADQiCIfCEEIANC/////w+DIAogE358IQMgBCADQiCIfCEEIANC/////w+DIA4gD358IQMgBCADQiCIfCEEIANC/////w+DIBIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AhAiFiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUC2A4iGSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRggA0L/////D4MgCSAYfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCFCIbfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgDiATfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgFiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIaIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLcDiIdIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhHCAEQv////8PgyAJIBx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIYIh9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIYIh4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gHH58IQMgBCADQiCIfCEEIANC/////w+DIBEgGH58IQMgBCADQiCIfCEEIANC/////w+DIBUgFH58IQMgBCADQiCIfCEEIANC/////w+DIBkgEH58IQMgBCADQiCIfCEEIANC/////w+DIB0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AuAOIiEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEgIANC/////w+DIAkgIH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhwiI358IQQgAyAEQiCIfCEDIARC/////w+DIAogH358IQQgAyAEQiCIfCEDIARC/////w+DIA4gG358IQQgAyAEQiCIfCEDIARC/////w+DIBIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBYgE358IQQgAyAEQiCIfCEDIARC/////w+DIBogD358IQQgAyAEQiCIfCEDIARC/////w+DIB4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhwiIiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgESAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgISAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUC5A4iJSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DISQgBEL/////D4MgCSAkfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAogI358IQMgBCADQiCIfCEEIANC/////w+DIA4gH358IQMgBCADQiCIfCEEIANC/////w+DIBIgG358IQMgBCADQiCIfCEEIANC/////w+DIBYgF358IQMgBCADQiCIfCEEIANC/////w+DIBogE358IQMgBCADQiCIfCEEIANC/////w+DIB4gD358IQMgBCADQiCIfCEEIANC/////w+DICIgC358IQMgBCADQiCIfCEEIANC/////w+DIA0gJH58IQMgBCADQiCIfCEEIANC/////w+DIBEgIH58IQMgBCADQiCIfCEEIANC/////w+DIBUgHH58IQMgBCADQiCIfCEEIANC/////w+DIBkgGH58IQMgBCADQiCIfCEEIANC/////w+DIB0gFH58IQMgBCADQiCIfCEEIANC/////w+DICEgEH58IQMgBCADQiCIfCEEIANC/////w+DICUgDH58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgDiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAffnwhBCADIARCIIh8IQMgBEL/////D4MgFiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgHiATfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgESAkfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgISAUfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAQfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyASICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAVICR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIBR+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIBYgI358IQQgAyAEQiCIfCEDIARC/////w+DIBogH358IQQgAyAEQiCIfCEDIARC/////w+DIB4gG358IQQgAyAEQiCIfCEDIARC/////w+DICIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBkgJH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gIH58IQQgAyAEQiCIfCEDIARC/////w+DICEgHH58IQQgAyAEQiCIfCEDIARC/////w+DICUgGH58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgGiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgIiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAcfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAeICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlICB+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DICIgI358IQMgBCADQiCIfCEEIANC/////w+DICUgJH58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgAiAEPgIcIAOnBEAgAkHIDiACEAcaBSACQcgOEAUEQCACQcgOIAIQBxoLCwu7IR0BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+Qv////8OIQZCACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAANQIAIgcgB358IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEIIAJC/////w+DQQA1AsgOIgkgCH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgQiCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8Pg0EANQLMDiIMIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCyACQv////8PgyAJIAt+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIIIg1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAKIAp+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC0A4iDyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQ4gAkL/////D4MgCSAOfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCDCIQfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiANfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgDn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AtQOIhIgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyERIAJC/////w+DIAkgEX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhAiE358IQIgAyACQiCIfCEDIAJC/////w+DIAogEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAPIA5+fCECIAMgAkIgiHwhAyACQv////8PgyASIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLYDiIVIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFCACQv////8PgyAJIBR+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIUIhZ+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBN+fCECIAMgAkIgiHwhAyACQv////8PgyANIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC3A4iGCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRcgAkL/////D4MgCSAXfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCGCIZfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgECAQfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgF358IQIgAyACQiCIfCEDIAJC/////w+DIA8gFH58IQIgAyACQiCIfCEDIAJC/////w+DIBIgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBggC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AuAOIhsgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEaIAJC/////w+DIAkgGn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhwiHH58IQIgAyACQiCIfCEDIAJC/////w+DIAogGX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gFn58IQIgAyACQiCIfCEDIAJC/////w+DIBAgE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBd+fCECIAMgAkIgiHwhAyACQv////8PgyASIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAYIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAbIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLkDiIeIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhHSACQv////8PgyAJIB1+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgEyATfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgHX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gGn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgF358IQIgAyACQiCIfCEDIAJC/////w+DIBUgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBggEX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gC358IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAWfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIA8gHX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgF358IQIgAyACQiCIfCEDIAJC/////w+DIBggFH58IQIgAyACQiCIfCEDIAJC/////w+DIBsgEX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gDn58IQIgAyACQiCIfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgFiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBIgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBggF358IQIgAyACQiCIfCEDIAJC/////w+DIBsgFH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gEX58IQIgAyACQiCIfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgEyAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBUgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBggGn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgF358IQIgAyACQiCIfCEDIAJC/////w+DIB4gFH58IQIgAyACQiCIfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgFiAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgGSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBggHX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgGn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gF358IQIgAyACQiCIfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgGSAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBsgHX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gGn58IQIgAyACQiCIfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgHCAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIB4gHX58IQIgAyACQiCIfCEDIAEgAj4CGCADIQQgBEIgiCEFIAEgBD4CHCAFpwRAIAFByA4gARAHGgUgAUHIDhAFBEAgAUHIDiABEAcaCwsLCgAgACAAIAEQKgsLACAAQYgPIAEQKgsVACAAQagVEABByBUQAUGoFSABECkLEQAgAEHoFRAuQegVQYgQEAULJAAgABACBEBBAA8LIABBiBYQLkGIFkGIEBAFBEBBfw8LQQEPCxcAIAAgARAuIAFByA4gARAOIAEgARAtCwkAQagPIAAQAAvLAQQBfwF/AX8BfyACEAFBICEFIAAhAwJAA0AgBSABSw0BIAVBIEYEQEGoFhAyBUGoFkGID0GoFhAqCyADQagWQcgWECogAkHIFiACECYgA0EgaiEDIAVBIGohBQwACwsgAUEgcCEEIARFBEAPC0HIFhABQQAhBgJAA0AgBiAERg0BIAYgAy0AADoAyBYgA0EBaiEDIAZBAWohBgwACwsgBUEgRgRAQagWEDIFQagWQYgPQagWECoLQcgWQagWQcgWECog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EEGIJUHIJCACEBEgAkHIJSACEBEgAEEgakHIJEHoJRAUQeglQeglQeglEBBBqCUgAiACQSBqEBEgAkEgakHoJCACQSBqEBQgAkEgakHoJSACQSBqEBEgA0HIIyACQcAAahAQIAJBwABqIAJBwABqEBUgAkHAAGpByCIgAkHAAGoQESACQcAAakHoIyACQcAAahARC7wDAgF/AX8gAEHAAGohAyABQcAAaiEEIAAQQARAIAEgAhBEDwsgARBABEAgACACEEQPCyADEA8EQCABIAAgAhBMDwsgBBAPBEAgACABIAIQTA8LIANBiCYQFSAEQagmEBUgAEGoJkHIJhAUIAFBiCZB6CYQFCADQYgmQYgnEBQgBEGoJkGoJxAUIABBIGpBqCdByCcQFCABQSBqQYgnQegnEBRByCZB6CYQBARAQcgnQegnEAQEQCAAIAIQSg8LC0HoJkHIJkGIKBARQegnQcgnQagoEBFBiChBiChByCgQEEHIKEHIKBAVQYgoQcgoQegoEBRBqChBqChBiCkQEEHIJkHIKEHIKRAUQYgpQagpEBVByClByClB6CkQEEGoKUHoKCACEBEgAkHoKSACEBFByCdB6ChBiCoQFEGIKkGIKkGIKhAQQcgpIAIgAkEgahARIAJBIGpBiCkgAkEgahAUIAJBIGpBiCogAkEgahARIAMgBCACQcAAahAQIAJBwABqIAJBwABqEBUgAkHAAGpBiCYgAkHAAGoQESACQcAAakGoJiACQcAAahARIAJBwABqQYgoIAJBwABqEBQLFAAgACABEAAgAEEgaiABQSBqEBILIgAgACABEAAgAEEgaiABQSBqEBIgAEHAAGogAUHAAGoQAAsSACABQagqEE4gAEGoKiACEEsLEgAgAUGIKxBOIABBiCsgAhBMCxIAIAFB6CsQTyAAQegrIAIQTQsUACAAIAEQGCAAQSBqIAFBIGoQGAsiACAAIAEQGCAAQSBqIAFBIGoQGCAAQcAAaiABQcAAahAYCxQAIAAgARAXIABBIGogAUEgahAXCyIAIAAgARAXIABBIGogAUEgahAXIABBwABqIAFBwABqEBcLSwAgABBABEAgARABIAFBIGoQAQUgAEHAAGpByCwQG0HILEHoLBAVQcgsQegsQYgtEBQgAEHoLCABEBQgAEEgakGILSABQSBqEBQLCzEAIABB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AEGI4gAQhQFBiOIAQYjiABCMASAAQajgAEEgQcjgABCWAUHI4ABBiOEAEIkBIABBiOEAQYjhABCHAUGI4QBByOEAEI0BQcjhAEGI4QBByOEAEIcBQcjhAEGI4gAQkAEEQEEADwtBAQ8LEQAgABCCASAAQcAAahCCAXELCwAgAEGAAWoQggELEAAgABCEASAAQcAAahCEAQsZACAAEIQBIABBwABqEIUBIABBgAFqEIQBC6IBACABIAApAwA3AwAgASAAKQMINwMIIAEgACkDEDcDECABIAApAxg3AxggASAAKQMgNwMgIAEgACkDKDcDKCABIAApAzA3AzAgASAAKQM4NwM4IAEgACkDQDcDQCABIAApA0g3A0ggASAAKQNQNwNQIAEgACkDWDcDWCABIAApA2A3A2AgASAAKQNoNwNoIAEgACkDcDcDcCABIAApA3g3A3gLggIAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYIAEgACkDYDcDYCABIAApA2g3A2ggASAAKQNwNwNwIAEgACkDeDcDeCABIAApA4ABNwOAASABIAApA4gBNwOIASABIAApA5ABNwOQASABIAApA5gBNwOYASABIAApA6ABNwOgASABIAApA6gBNwOoASABIAApA7ABNwOwASABIAApA7gBNwO4AQsvACAAEJkBBEAgARCcAQUgAUGAAWoQhQEgAEHAAGogAUHAAGoQhgEgACABEIYBCwscAQF/IAAgARCQASAAQcAAaiABQcAAahCQAXEPC4sBAQF/IABBgAFqIQIgABCaAQRAIAEQmQEPCyABEJkBBEBBAA8LIAIQgwEEQCAAIAEQoAEPCyACQYjjABCJASABQYjjAEHI4wAQhwEgAkGI4wBBiOQAEIcBIAFBwABqQYjkAEHI5AAQhwEgAEHI4wAQkAEEQCAAQcAAakHI5AAQkAEEQEEBDwsLQQAPC9kBAgF/AX8gAEGAAWohAiABQYABaiEDIAAQmgEEQCABEJoBDwsgARCaAQRAQQAPCyACEIMBBEAgASAAEKEBDwsgAxCDAQRAIAAgARChAQ8L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ACAAQeAAaiABQeAAahASIAFBwABqQbCFBCABQcAAahCHASAAQYABaiABQYABahAAIABBoAFqIAFBoAFqEBIgAUGAAWpB8IUEIAFBgAFqEIcBIABBwAFqIAFBwAFqEAAgAEHgAWogAUHgAWoQEiABQcABakGwhgQgAUHAAWoQhwEgAEGAAmogAUGAAmoQACAAQaACaiABQaACahASIAFBgAJqQfCGBCABQYACahCHASAAQcACaiABQcACahAAIABB4AJqIAFB4AJqEBIgAUHAAmpBsIcEIAFBwAJqEIcBC2wAIABB8IcEIAEQhwEgAEHAAGpBsIgEIAFBwABqEIcBIABBgAFqQfCIBCABQYABahCHASAAQcABakGwiQQgAUHAAWoQhwEgAEGAAmpB8IkEIAFBgAJqEIcBIABBwAJqQbCKBCABQcACahCHAQuKAgAgACABEAAgAEEgaiABQSBqEBIgAUHwigQgARCHASAAQcAAaiABQcAAahAAIABB4ABqIAFB4ABqEBIgAUHAAGpBsIsEIAFBwABqEIcBIABBgAFqIAFBgAFqEAAgAEGgAWogAUGgAWoQEiABQYABakHwiwQgAUGAAWoQhwEgAEHAAWogAUHAAWoQACAAQeABaiABQeABahASIAFBwAFqQbCMBCABQcABahCHASAAQYACaiABQYACahAAIABBoAJqIAFBoAJqEBIgAUGAAmpB8IwEIAFBgAJqEIcBIABBwAJqIAFBwAJqEAAgAEHgAmogAUHgAmoQEiABQcACakGwjQQgAUHAAmoQhwELbAAgAEHwjQQgARCHASAAQcAAakGwjgQgAUHAAGoQhwEgAEGAAWpB8I4EIAFBgAFqEIcBIABBwAFqQbCPBCABQcABahCHASAAQYACakHwjwQgAUGAAmoQhwEgAEHAAmpBsJAEIAFBwAJqEIcBC4oCACAAIAEQACAAQSBqIAFBIGoQEiABQfCQBCABEIcBIABBwABqIAFBwABqEAAgAEHgAGogAUHgAGoQEiABQcAAakGwkQQgAUHAAGoQhwEgAEGAAWogAUGAAWoQACAAQaABaiABQaABahASIAFBgAFqQfCRBCABQYABahCHASAAQcABaiABQcABahAAIABB4AFqIAFB4AFqEBIgAUHAAWpBsJIEIAFBwAFqEIcBIABBgAJqIAFBgAJqEAAgAEGgAmogAUGgAmoQEiABQYACakHwkgQgAUGAAmoQhwEgAEHAAmogAUHAAmoQACAAQeACaiABQeACahASIAFBwAJqQbCTBCABQcACahCHAQtsACAAQfCTBCABEIcBIABBwABqQbCUBCABQcAAahCHASAAQYABakHwlAQgAUGAAWoQhwEgAEHAAWpBsJUEIAFBwAFqEIcBIABBgAJqQfCVBCABQYACahCHASAAQcACakGwlgQgAUHAAmoQhwELigIAIAAgARAAIABBIGogAUEgahASIAFB8JYEIAEQhwEgAEHAAGogAUHAAGoQACAAQeAAaiABQeAAahASIAFBwABqQbCXBCABQcAAahCHASAAQYABaiABQYABahAAIABBoAFqIAFBoAFqEBIgAUGAAWpB8JcEIAFBgAFqEIcBIABBwAFqIAFBwAFqEAAgAEHgAWogAUHgAWoQEiABQcABakGwmAQgAUHAAWoQhwEgAEGAAmogAUGAAmoQACAAQaACaiABQaACahASIAFBgAJqQfCYBCABQYACahCHASAAQcACaiABQcACahAAIABB4AJqIAFB4AJqEBIgAUHAAmpBsJkEIAFBwAJqEIcBC2wAIABB8JkEIAEQhwEgAEHAAGpBsJoEIAFBwABqEIcBIABBgAFqQfCaBCABQYABahCHASAAQcABakGwmwQgAUHAAWoQhwEgAEGAAmpB8JsEIAFBgAJqEIcBIABBwAJqQbCcBCABQcACahCHAQuKAgAgACABEAAgAEEgaiABQSBqEBIgAUHwnAQgARCHASAAQcAAaiABQcAAahAAIABB4ABqIAFB4ABqEBIgAUHAAGpBsJ0EIAFBwABqEIcBIABBgAFqIAFBgAFqEAAgAEGgAWogAUGgAWoQEiABQYABakHwnQQgAUGAAWoQhwEgAEHAAWogAUHAAWoQACAAQeABaiABQeABahASIAFBwAFqQbCeBCABQcABahCHASAAQYACaiABQYACahAAIABBoAJqIAFBoAJqEBIgAUGAAmpB8J4EIAFBgAJqEIcBIABBwAJqIAFBwAJqEAAgAEHgAmogAUHgAmoQEiABQcACakGwnwQgAUHAAmoQhwELEAAgAEHwnwRB4AIgARCWAgtIACAAQdCiBBDyASAAQcABakGQpAQQ9wEgAEHQpQQQkQJB0KIEQdClBEHQqAQQhwJB0KgE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";
                var pq = 520;
                var pr = 1864;
                var pG1gen = 31592;
                var pG1zero = 31688;
                var pG1b = 3240;
                var pG2gen = 31784;
                var pG2zero = 31976;
                var pG2b = 12616;
                var pOneT = 32168;
                var prePSize = 192;
                var preQSize = 19776;
                var n8q = 32;
                var n8r = 32;
                var q = "21888242871839275222246405745257275088696311157297823662689037894645226208583";
                var r = "21888242871839275222246405745257275088548364400416034343698204186575808495617";

    var bn128_wasm = {
    	code: code,
    	pq: pq,
    	pr: pr,
    	pG1gen: pG1gen,
    	pG1zero: pG1zero,
    	pG1b: pG1b,
    	pG2gen: pG2gen,
    	pG2zero: pG2zero,
    	pG2b: pG2b,
    	pOneT: pOneT,
    	prePSize: prePSize,
    	preQSize: preQSize,
    	n8q: n8q,
    	n8r: n8r,
    	q: q,
    	r: r
    };

    var code$1 = "AGFzbQEAAAABlAESYAJ/fwBgAX8AYAF/AX9gAn9/AX9gA39/fwF/YAN/f38AYAN/fn8AYAJ/fgBgBH9/f38AYAV/f39/fwBgBH9/f38Bf2AHf39/f39/fwBgBn9/f39/fwBgCn9/f39/f39/f38AYAV/f39/fwF/YAd/f39/f39/AX9gCX9/f39/f39/fwF/YAt/f39/f39/f39/fwF/Ag8BA2VudgZtZW1vcnkCABkDywLJAgABAgEDAwQEBQAABgcIBQIFBQAABQAAAAACAgABBQgJBQUIAAIAAQIBAwMEBAUAAAYHCAUCBQUAAAUAAAAAAgIAAQUICQUFCAACBQAAAgICAQEAAAADAwMAAAUFBQAABQUFAAAAAAACAgUABQAAAAAFBQUFBQoACwkKAAsJCAgDAAgIAgAACQwMBQUMAAgNCQgCAgEBAAUFAAUFAAAAAAMACAICCQgAAgICAQEAAAADAwMAAAUFBQAABQUFAAAAAAACAgUABQAAAAAFBQUFBQoACwkKAAsJCAgFAwAICAIAAAkMDAUFDAUDAAgIAgAACQwMBQUMBQUJCQkJCQACAgEBAAUABQUAAgAAAwAIAgkIAAICAQEABQUABQUAAAAAAwAIAgIJCAACBQgJBQAAAAAAAAAAAAACAgICBQAAAAUAAAAABA4PEBEFB/gmugIJaW50cV9jb3B5AAAJaW50cV96ZXJvAAEIaW50cV9vbmUAAwtpbnRxX2lzWmVybwACB2ludHFfZXEABAhpbnRxX2d0ZQAFCGludHFfYWRkAAYIaW50cV9zdWIABwhpbnRxX211bAAIC2ludHFfc3F1YXJlAAkOaW50cV9zcXVhcmVPbGQACghpbnRxX2RpdgAND2ludHFfaW52ZXJzZU1vZAAOCGYxbV9jb3B5AAAIZjFtX3plcm8AAQpmMW1faXNaZXJvAAIGZjFtX2VxAAQHZjFtX2FkZAAQB2YxbV9zdWIAEQdmMW1fbmVnABIOZjFtX2lzTmVnYXRpdmUAGQlmMW1faXNPbmUADwhmMW1fc2lnbgAaC2YxbV9tUmVkdWN0ABMHZjFtX211bAAUCmYxbV9zcXVhcmUAFQ1mMW1fc3F1YXJlT2xkABYSZjFtX2Zyb21Nb250Z29tZXJ5ABgQZjFtX3RvTW9udGdvbWVyeQAXC2YxbV9pbnZlcnNlABsHZjFtX29uZQAcCGYxbV9sb2FkAB0PZjFtX3RpbWVzU2NhbGFyAB4HZjFtX2V4cAAiEGYxbV9iYXRjaEludmVyc2UAHwhmMW1fc3FydAAjDGYxbV9pc1NxdWFyZQAkFWYxbV9iYXRjaFRvTW9udGdvbWVyeQAgF2YxbV9iYXRjaEZyb21Nb250Z29tZXJ5ACEJaW50cl9jb3B5ACUJaW50cl96ZXJvACYIaW50cl9vbmUAKAtpbnRyX2lzWmVybwAnB2ludHJfZXEAKQhpbnRyX2d0ZQAqCGludHJfYWRkACsIaW50cl9zdWIALAhpbnRyX211bAAtC2ludHJfc3F1YXJlAC4OaW50cl9zcXVhcmVPbGQALwhpbnRyX2RpdgAyD2ludHJfaW52ZXJzZU1vZAAzCGZybV9jb3B5ACUIZnJtX3plcm8AJgpmcm1faXNaZXJvACcGZnJtX2VxACkHZnJtX2FkZAA1B2ZybV9zdWIANgdmcm1fbmVnADcOZnJtX2lzTmVnYXRpdmUAPglmcm1faXNPbmUANAhmcm1fc2lnbgA/C2ZybV9tUmVkdWN0ADgHZnJtX211bAA5CmZybV9zcXVhcmUAOg1mcm1fc3F1YXJlT2xkADsSZnJtX2Zyb21Nb250Z29tZXJ5AD0QZnJtX3RvTW9udGdvbWVyeQA8C2ZybV9pbnZlcnNlAEAHZnJtX29uZQBBCGZybV9sb2FkAEIPZnJtX3RpbWVzU2NhbGFyAEMHZnJtX2V4cABHEGZybV9iYXRjaEludmVyc2UARAhmcm1fc3FydABIDGZybV9pc1NxdWFyZQBJFWZybV9iYXRjaFRvTW9udGdvbWVyeQBFF2ZybV9iYXRjaEZyb21Nb250Z29tZXJ5AEYGZnJfYWRkADUGZnJfc3ViADYGZnJfbmVnADcGZnJfbXVsAEoJZnJfc3F1YXJlAEsKZnJfaW52ZXJzZQBMDWZyX2lzTmVnYXRpdmUATQdmcl9jb3B5ACUHZnJfemVybwAmBmZyX29uZQBBCWZyX2lzWmVybwAnBWZyX2VxACkMZzFtX211bHRpZXhwAHgSZzFtX211bHRpZXhwX2NodW5rAHcSZzFtX211bHRpZXhwQWZmaW5lAHwYZzFtX211bHRpZXhwQWZmaW5lX2NodW5rAHsKZzFtX2lzWmVybwBPEGcxbV9pc1plcm9BZmZpbmUATgZnMW1fZXEAVwtnMW1fZXFNaXhlZABWDGcxbV9lcUFmZmluZQBVCGcxbV9jb3B5AFMOZzFtX2NvcHlBZmZpbmUAUghnMW1femVybwBRDmcxbV96ZXJvQWZmaW5lAFAKZzFtX2RvdWJsZQBZEGcxbV9kb3VibGVBZmZpbmUAWAdnMW1fYWRkAFwMZzFtX2FkZE1peGVkAFsNZzFtX2FkZEFmZmluZQBaB2cxbV9uZWcAXg1nMW1fbmVnQWZmaW5lAF0HZzFtX3N1YgBhDGcxbV9zdWJNaXhlZABgDWcxbV9zdWJBZmZpbmUAXxJnMW1fZnJvbU1vbnRnb21lcnkAYxhnMW1fZnJvbU1vbnRnb21lcnlBZmZpbmUAYhBnMW1fdG9Nb250Z29tZXJ5AGUWZzFtX3RvTW9udGdvbWVyeUFmZmluZQBkD2cxbV90aW1lc1NjYWxhcgB9FWcxbV90aW1lc1NjYWxhckFmZmluZQB+DWcxbV9ub3JtYWxpemUAagpnMW1fTEVNdG9VAGwKZzFtX0xFTXRvQwBtCmcxbV9VdG9MRU0AbgpnMW1fQ3RvTEVNAG8PZzFtX2JhdGNoTEVNdG9VAHAPZzFtX2JhdGNoTEVNdG9DAHEPZzFtX2JhdGNoVXRvTEVNAHIPZzFtX2JhdGNoQ3RvTEVNAHMMZzFtX3RvQWZmaW5lAGYOZzFtX3RvSmFjb2JpYW4AVBFnMW1fYmF0Y2hUb0FmZmluZQBpE2cxbV9iYXRjaFRvSmFjb2JpYW4AdAtnMW1faW5DdXJ2ZQBoEWcxbV9pbkN1cnZlQWZmaW5lAGcHZnJtX2ZmdACEAQhmcm1faWZmdACFAQpmcm1fcmF3ZmZ0AIIBC2ZybV9mZnRKb2luAIYBDmZybV9mZnRKb2luRXh0AIcBEWZybV9mZnRKb2luRXh0SW52AIgBCmZybV9mZnRNaXgAiQEMZnJtX2ZmdEZpbmFsAIoBHWZybV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAIsBCHBvbF96ZXJvAIwBD3BvbF9jb25zdHJ1Y3RMQwCNAQxxYXBfYnVpbGRBQkMAjgELcWFwX2pvaW5BQkMAjwEMcWFwX2JhdGNoQWRkAJABCmYybV9pc1plcm8AkQEJZjJtX2lzT25lAJIBCGYybV96ZXJvAJMBB2YybV9vbmUAlAEIZjJtX2NvcHkAlQEHZjJtX211bACWAQhmMm1fbXVsMQCXAQpmMm1fc3F1YXJlAJgBB2YybV9hZGQAmQEHZjJtX3N1YgCaAQdmMm1fbmVnAJsBCGYybV9zaWduAKIBDWYybV9jb25qdWdhdGUAnAESZjJtX2Zyb21Nb250Z29tZXJ5AJ4BEGYybV90b01vbnRnb21lcnkAnQEGZjJtX2VxAJ8BC2YybV9pbnZlcnNlAKABB2YybV9leHAApQEPZjJtX3RpbWVzU2NhbGFyAKEBEGYybV9iYXRjaEludmVyc2UApAEIZjJtX3NxcnQApgEMZjJtX2lzU3F1YXJlAKcBDmYybV9pc05lZ2F0aXZlAKMBDGcybV9tdWx0aWV4cADSARJnMm1fbXVsdGlleHBfY2h1bmsA0QESZzJtX211bHRpZXhwQWZmaW5lANYBGGcybV9tdWx0aWV4cEFmZmluZV9jaHVuawDVAQpnMm1faXNaZXJvAKkBEGcybV9pc1plcm9BZmZpbmUAqAEGZzJtX2VxALEBC2cybV9lcU1peGVkALABDGcybV9lcUFmZmluZQCvAQhnMm1fY29weQCtAQ5nMm1fY29weUFmZmluZQCsAQhnMm1femVybwCrAQ5nMm1femVyb0FmZmluZQCqAQpnMm1fZG91YmxlALMBEGcybV9kb3VibGVBZmZpbmUAsgEHZzJtX2FkZAC2AQxnMm1fYWRkTWl4ZWQAtQENZzJtX2FkZEFmZmluZQC0AQdnMm1fbmVnALgBDWcybV9uZWdBZmZpbmUAtwEHZzJtX3N1YgC7AQxnMm1fc3ViTWl4ZWQAugENZzJtX3N1YkFmZmluZQC5ARJnMm1fZnJvbU1vbnRnb21lcnkAvQEYZzJtX2Zyb21Nb250Z29tZXJ5QWZmaW5lALwBEGcybV90b01vbnRnb21lcnkAvwEWZzJtX3RvTW9udGdvbWVyeUFmZmluZQC+AQ9nMm1fdGltZXNTY2FsYXIA1wEVZzJtX3RpbWVzU2NhbGFyQWZmaW5lANgBDWcybV9ub3JtYWxpemUAxAEKZzJtX0xFTXRvVQDGAQpnMm1fTEVNdG9DAMcBCmcybV9VdG9MRU0AyAEKZzJtX0N0b0xFTQDJAQ9nMm1fYmF0Y2hMRU10b1UAygEPZzJtX2JhdGNoTEVNdG9DAMsBD2cybV9iYXRjaFV0b0xFTQDMAQ9nMm1fYmF0Y2hDdG9MRU0AzQEMZzJtX3RvQWZmaW5lAMABDmcybV90b0phY29iaWFuAK4BEWcybV9iYXRjaFRvQWZmaW5lAMMBE2cybV9iYXRjaFRvSmFjb2JpYW4AzgELZzJtX2luQ3VydmUAwgERZzJtX2luQ3VydmVBZmZpbmUAwQELZzFtX3RpbWVzRnIA2QEHZzFtX2ZmdADfAQhnMW1faWZmdADgAQpnMW1fcmF3ZmZ0AN0BC2cxbV9mZnRKb2luAOEBDmcxbV9mZnRKb2luRXh0AOIBEWcxbV9mZnRKb2luRXh0SW52AOMBCmcxbV9mZnRNaXgA5AEMZzFtX2ZmdEZpbmFsAOUBHWcxbV9wcmVwYXJlTGFncmFuZ2VFdmFsdWF0aW9uAOYBC2cybV90aW1lc0ZyAOcBB2cybV9mZnQA7QEIZzJtX2lmZnQA7gEKZzJtX3Jhd2ZmdADrAQtnMm1fZmZ0Sm9pbgDvAQ5nMm1fZmZ0Sm9pbkV4dADwARFnMm1fZmZ0Sm9pbkV4dEludgDxAQpnMm1fZmZ0TWl4APIBDGcybV9mZnRGaW5hbADzAR1nMm1fcHJlcGFyZUxhZ3JhbmdlRXZhbHVhdGlvbgD0ARFnMW1fdGltZXNGckFmZmluZQD1ARFnMm1fdGltZXNGckFmZmluZQD2ARFmcm1fYmF0Y2hBcHBseUtleQD3ARFnMW1fYmF0Y2hBcHBseUtleQD4ARZnMW1fYmF0Y2hBcHBseUtleU1peGVkAPkBEWcybV9iYXRjaEFwcGx5S2V5APoBFmcybV9iYXRjaEFwcGx5S2V5TWl4ZWQA+wEKZjZtX2lzWmVybwD9AQlmNm1faXNPbmUA/gEIZjZtX3plcm8A/wEHZjZtX29uZQCAAghmNm1fY29weQCBAgdmNm1fbXVsAIICCmY2bV9zcXVhcmUAgwIHZjZtX2FkZACEAgdmNm1fc3ViAIUCB2Y2bV9uZWcAhgIIZjZtX3NpZ24AhwISZjZtX2Zyb21Nb250Z29tZXJ5AIkCEGY2bV90b01vbnRnb21lcnkAiAIGZjZtX2VxAIoCC2Y2bV9pbnZlcnNlAIsCB2Y2bV9leHAAjwIPZjZtX3RpbWVzU2NhbGFyAIwCEGY2bV9iYXRjaEludmVyc2UAjgIOZjZtX2lzTmVnYXRpdmUAjQIKZnRtX2lzWmVybwCRAglmdG1faXNPbmUAkgIIZnRtX3plcm8AkwIHZnRtX29uZQCUAghmdG1fY29weQCVAgdmdG1fbXVsAJYCCGZ0bV9tdWwxAJcCCmZ0bV9zcXVhcmUAmAIHZnRtX2FkZACZAgdmdG1fc3ViAJoCB2Z0bV9uZWcAmwIIZnRtX3NpZ24AogINZnRtX2Nvbmp1Z2F0ZQCcAhJmdG1fZnJvbU1vbnRnb21lcnkAngIQZnRtX3RvTW9udGdvbWVyeQCdAgZmdG1fZXEAnwILZnRtX2ludmVyc2UAoAIHZnRtX2V4cAClAg9mdG1fdGltZXNTY2FsYXIAoQIQZnRtX2JhdGNoSW52ZXJzZQCkAghmdG1fc3FydACmAgxmdG1faXNTcXVhcmUApwIOZnRtX2lzTmVnYXRpdmUAowIRZnRtX2Zyb2Jlbml1c01hcDAArAIRZnRtX2Zyb2Jlbml1c01hcDEArQIRZnRtX2Zyb2Jlbml1c01hcDIArgIRZnRtX2Zyb2Jlbml1c01hcDMArwIRZnRtX2Zyb2Jlbml1c01hcDQAsAIRZnRtX2Zyb2Jlbml1c01hcDUAsQIRZnRtX2Zyb2Jlbml1c01hcDYAsgIRZnRtX2Zyb2Jlbml1c01hcDcAswIRZnRtX2Zyb2Jlbml1c01hcDgAtAIRZnRtX2Zyb2Jlbml1c01hcDkAtQITYmxzMTIzODFfcGFpcmluZ0VxMQDDAhNibHMxMjM4MV9wYWlyaW5nRXEyAMQCE2JsczEyMzgxX3BhaXJpbmdFcTMAxQITYmxzMTIzODFfcGFpcmluZ0VxNADGAhNibHMxMjM4MV9wYWlyaW5nRXE1AMcCEGJsczEyMzgxX3BhaXJpbmcAyAISYmxzMTIzODFfcHJlcGFyZUcxALwCEmJsczEyMzgxX3ByZXBhcmVHMgC9AhNibHMxMjM4MV9taWxsZXJMb29wAL4CHGJsczEyMzgxX2ZpbmFsRXhwb25lbnRpYXRpb24AwgIfYmxzMTIzODFfZmluYWxFeHBvbmVudGlhdGlvbk9sZAC/AhpibHMxMjM4MV9fY3ljbG90b21pY1NxdWFyZQDAAhpibHMxMjM4MV9fY3ljbG90b21pY0V4cF93MADBAghmNm1fbXVsMQCoAglmNm1fbXVsMDEAqQIKZnRtX211bDAxNACqAhFnMW1faW5Hcm91cEFmZmluZQC2AgtnMW1faW5Hcm91cAC3AhFnMm1faW5Hcm91cEFmZmluZQC4AgtnMm1faW5Hcm91cAC5AgqEkQXJAj4AIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoCywAIABCADcDACAAQgA3AwggAEIANwMQIABCADcDGCAAQgA3AyAgAEIANwMoC00AIAApAyhQBEAgACkDIFAEQCAAKQMYUARAIAApAxBQBEAgACkDCFAEQCAAKQMAUA8FQQAPCwVBAA8LBUEADwsFQQAPCwVBAA8LQQAPCywAIABCATcDACAAQgA3AwggAEIANwMQIABCADcDGCAAQgA3AyAgAEIANwMoC2sAIAApAyggASkDKFEEQCAAKQMgIAEpAyBRBEAgACkDGCABKQMYUQRAIAApAxAgASkDEFEEQCAAKQMIIAEpAwhRBEAgACkDACABKQMAUQ8FQQAPCwVBAA8LBUEADwsFQQAPCwVBAA8LQQAPC8UBACAAKQMoIAEpAyhUBEBBAA8FIAApAyggASkDKFYEQEEBDwUgACkDICABKQMgVARAQQAPBSAAKQMgIAEpAyBWBEBBAQ8FIAApAxggASkDGFQEQEEADwUgACkDGCABKQMYVgRAQQEPBSAAKQMQIAEpAxBUBEBBAA8FIAApAxAgASkDEFYEQEEBDwUgACkDCCABKQMIVARAQQAPBSAAKQMIIAEpAwhWBEBBAQ8FIAApAwAgASkDAFoPCwsLCwsLCwsLC0EADwu8AgEBfiAANQIAIAE1AgB8IQMgAiADPgIAIAA1AgQgATUCBHwgA0IgiHwhAyACIAM+AgQgADUCCCABNQIIfCADQiCIfCEDIAIgAz4CCCAANQIMIAE1Agx8IANCIIh8IQMgAiADPgIMIAA1AhAgATUCEHwgA0IgiHwhAyACIAM+AhAgADUCFCABNQIUfCADQiCIfCEDIAIgAz4CFCAANQIYIAE1Ahh8IANCIIh8IQMgAiADPgIYIAA1AhwgATUCHHwgA0IgiHwhAyACIAM+AhwgADUCICABNQIgfCADQiCIfCEDIAIgAz4CICAANQIkIAE1AiR8IANCIIh8IQMgAiADPgIkIAA1AiggATUCKHwgA0IgiHwhAyACIAM+AiggADUCLCABNQIsfCADQiCIfCEDIAIgAz4CLCADQiCIpwuQAwEBfiAANQIAIAE1AgB9IQMgAiADQv////8Pgz4CACAANQIEIAE1AgR9IANCIId8IQMgAiADQv////8Pgz4CBCAANQIIIAE1Agh9IANCIId8IQMgAiADQv////8Pgz4CCCAANQIMIAE1Agx9IANCIId8IQMgAiADQv////8Pgz4CDCAANQIQIAE1AhB9IANCIId8IQMgAiADQv////8Pgz4CECAANQIUIAE1AhR9IANCIId8IQMgAiADQv////8Pgz4CFCAANQIYIAE1Ahh9IANCIId8IQMgAiADQv////8Pgz4CGCAANQIcIAE1Ahx9IANCIId8IQMgAiADQv////8Pgz4CHCAANQIgIAE1AiB9IANCIId8IQMgAiADQv////8Pgz4CICAANQIkIAE1AiR9IANCIId8IQMgAiADQv////8Pgz4CJCAANQIoIAE1Aih9IANCIId8IQMgAiADQv////8Pgz4CKCAANQIsIAE1Aix9IANCIId8IQMgAiADQv////8Pgz4CLCADQiCHpwunIhoBfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+IANC/////w+DIAA1AgAiBSABNQIAIgZ+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIAUgATUCBCIIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIHIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIAUgATUCCCIKfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIJIAZ+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIAUgATUCDCIMfnwhBCADIARCIIh8IQMgBEL/////D4MgByAKfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCILIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIAUgATUCECIOfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECINIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIAUgATUCFCIQfnwhBCADIARCIIh8IQMgBEL/////D4MgByAOfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIPIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DIAUgATUCGCISfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIRIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIARC/////w+DIAUgATUCHCIUfnwhBCADIARCIIh8IQMgBEL/////D4MgByASfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgESAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCITIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DIAUgATUCICIWfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCICIVIAZ+fCEDIAQgA0IgiHwhBCACIAM+AiAgBEIgiCEDIARC/////w+DIAUgATUCJCIYfnwhBCADIARCIIh8IQMgBEL/////D4MgByAWfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgCyASfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCJCIXIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AiQgA0IgiCEEIANC/////w+DIAUgATUCKCIafnwhAyAEIANCIIh8IQQgA0L/////D4MgByAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAWfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgFyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCKCIZIAZ+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIARC/////w+DIAUgATUCLCIcfnwhBCADIARCIIh8IQMgBEL/////D4MgByAafnwhBCADIARCIIh8IQMgBEL/////D4MgCSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAWfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgDyASfnwhBCADIARCIIh8IQMgBEL/////D4MgESAQfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgFyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCLCIbIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AiwgA0IgiCEEIANC/////w+DIAcgHH58IQMgBCADQiCIfCEEIANC/////w+DIAkgGn58IQMgBCADQiCIfCEEIANC/////w+DIAsgGH58IQMgBCADQiCIfCEEIANC/////w+DIA0gFn58IQMgBCADQiCIfCEEIANC/////w+DIA8gFH58IQMgBCADQiCIfCEEIANC/////w+DIBEgEn58IQMgBCADQiCIfCEEIANC/////w+DIBMgEH58IQMgBCADQiCIfCEEIANC/////w+DIBUgDn58IQMgBCADQiCIfCEEIANC/////w+DIBcgDH58IQMgBCADQiCIfCEEIANC/////w+DIBkgCn58IQMgBCADQiCIfCEEIANC/////w+DIBsgCH58IQMgBCADQiCIfCEEIAIgAz4CMCAEQiCIIQMgBEL/////D4MgCSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAafnwhBCADIARCIIh8IQMgBEL/////D4MgDSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAWfnwhBCADIARCIIh8IQMgBEL/////D4MgESAUfnwhBCADIARCIIh8IQMgBEL/////D4MgEyASfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgFyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgGyAKfnwhBCADIARCIIh8IQMgAiAEPgI0IANCIIghBCADQv////8PgyALIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBZ+fCEDIAQgA0IgiHwhBCADQv////8PgyATIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAXIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIAx+fCEDIAQgA0IgiHwhBCACIAM+AjggBEIgiCEDIARC/////w+DIA0gHH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gGn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgFn58IQQgAyAEQiCIfCEDIARC/////w+DIBUgFH58IQQgAyAEQiCIfCEDIARC/////w+DIBcgEn58IQQgAyAEQiCIfCEDIARC/////w+DIBkgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgDn58IQQgAyAEQiCIfCEDIAIgBD4CPCADQiCIIQQgA0L/////D4MgDyAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAafnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAWfnwhAyAEIANCIIh8IQQgA0L/////D4MgFyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSASfnwhAyAEIANCIIh8IQQgA0L/////D4MgGyAQfnwhAyAEIANCIIh8IQQgAiADPgJAIARCIIghAyAEQv////8PgyARIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBp+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAXIBZ+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAbIBJ+fCEEIAMgBEIgiHwhAyACIAQ+AkQgA0IgiCEEIANC/////w+DIBMgHH58IQMgBCADQiCIfCEEIANC/////w+DIBUgGn58IQMgBCADQiCIfCEEIANC/////w+DIBcgGH58IQMgBCADQiCIfCEEIANC/////w+DIBkgFn58IQMgBCADQiCIfCEEIANC/////w+DIBsgFH58IQMgBCADQiCIfCEEIAIgAz4CSCAEQiCIIQMgBEL/////D4MgFSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgFyAafnwhBCADIARCIIh8IQMgBEL/////D4MgGSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgGyAWfnwhBCADIARCIIh8IQMgAiAEPgJMIANCIIghBCADQv////8PgyAXIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBp+fCEDIAQgA0IgiHwhBCADQv////8PgyAbIBh+fCEDIAQgA0IgiHwhBCACIAM+AlAgBEIgiCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBsgGn58IQQgAyAEQiCIfCEDIAIgBD4CVCADQiCIIQQgA0L/////D4MgGyAcfnwhAyAEIANCIIh8IQQgAiADPgJYIARCIIghAyACIAQ+AlwLziAQAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5CACECQgAhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAANQIAIgYgBn58IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIEIgd+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIEIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AggiCH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAcgB358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCDCIJfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAIfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIQIgp+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAl+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAIIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIQIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhQiC358IQIgAyACQiCIfCEDIAJC/////w+DIAcgCn58IQIgAyACQiCIfCEDIAJC/////w+DIAggCX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCGCIMfnwhAiADIAJCIIh8IQMgAkL/////D4MgByALfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCSAJfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CGCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIcIg1+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAx+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAJIAp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIcIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AiAiDn58IQIgAyACQiCIfCEDIAJC/////w+DIAcgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAggDH58IQIgAyACQiCIfCEDIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCJCIPfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCANfnwhAiADIAJCIIh8IQMgAkL/////D4MgCSAMfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiALfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CJCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIoIhB+fCECIAMgAkIgiHwhAyACQv////8PgyAHIA9+fCECIAMgAkIgiHwhAyACQv////8PgyAIIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAJIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAKIAx+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyALIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIoIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AiwiEX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgEH58IQIgAyACQiCIfCEDIAJC/////w+DIAggD358IQIgAyACQiCIfCEDIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DIAsgDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgEX58IQIgAyACQiCIfCEDIAJC/////w+DIAggEH58IQIgAyACQiCIfCEDIAJC/////w+DIAkgD358IQIgAyACQiCIfCEDIAJC/////w+DIAogDn58IQIgAyACQiCIfCEDIAJC/////w+DIAsgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAwgDH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAggEX58IQIgAyACQiCIfCEDIAJC/////w+DIAkgEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogD358IQIgAyACQiCIfCEDIAJC/////w+DIAsgDn58IQIgAyACQiCIfCEDIAJC/////w+DIAwgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAkgEX58IQIgAyACQiCIfCEDIAJC/////w+DIAogEH58IQIgAyACQiCIfCEDIAJC/////w+DIAsgD358IQIgAyACQiCIfCEDIAJC/////w+DIAwgDn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogEX58IQIgAyACQiCIfCEDIAJC/////w+DIAsgEH58IQIgAyACQiCIfCEDIAJC/////w+DIAwgD358IQIgAyACQiCIfCEDIAJC/////w+DIA0gDn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAsgEX58IQIgAyACQiCIfCEDIAJC/////w+DIAwgEH58IQIgAyACQiCIfCEDIAJC/////w+DIA0gD358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA4gDn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AkAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAwgEX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gEH58IQIgAyACQiCIfCEDIAJC/////w+DIA4gD358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AkQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA0gEX58IQIgAyACQiCIfCEDIAJC/////w+DIA4gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA8gD358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AkggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA4gEX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AkwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AlAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBAgEX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AlQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBEgEX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwg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D4MgDSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCgAYiESAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRAgA0L/////D4MgCSAQfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCDCITfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgDiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCISIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKEBiIVIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhFCAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIQIhd+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIhYgB358IQMgBCADQiCIfCEEIANC/////w+DIA0gFH58IQMgBCADQiCIfCEEIANC/////w+DIBEgEH58IQMgBCADQiCIfCEEIANC/////w+DIBUgDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AogGIhkgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEYIANC/////w+DIAkgGH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhQiG358IQQgAyAEQiCIfCEDIARC/////w+DIAogF358IQQgAyAEQiCIfCEDIARC/////w+DIA4gE358IQQgAyAEQiCIfCEDIARC/////w+DIBIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBYgC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhQiGiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgESAUfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCjAYiHSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRwgBEL/////D4MgCSAcfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCGCIffnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIeIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQKQBiIhIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhICADQv////8PgyAJICB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIcIiN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIiIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gIH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gEH58IQQgAyAEQiCIfCEDIARC/////w+DICEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1ApQGIiUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEkIARC/////w+DIAkgJH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AiAiJ358IQMgBCADQiCIfCEEIANC/////w+DIAogI358IQMgBCADQiCIfCEEIANC/////w+DIA4gH358IQMgBCADQiCIfCEEIANC/////w+DIBIgG358IQMgBCADQiCIfCEEIANC/////w+DIBYgF358IQMgBCADQiCIfCEEIANC/////w+DIBogE358IQMgBCADQiCIfCEEIANC/////w+DIB4gD358IQMgBCADQiCIfCEEIANC/////w+DICIgC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AiAiJiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgESAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCmAYiKSAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DISggA0L/////D4MgCSAofnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCJCIrfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgDiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAffnwhBCADIARCIIh8IQMgBEL/////D4MgFiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgHiATfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgJiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCJCIqIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyARICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAVICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdIBh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyApIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQKcBiItIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhLCAEQv////8PgyAJICx+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIoIi9+fCEDIAQgA0IgiHwhBCADQv////8PgyAKICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAOICd+fCEDIAQgA0IgiHwhBCADQv////8PgyASICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAmIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAqIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIoIi4gB358IQMgBCADQiCIfCEEIANC/////w+DIA0gLH58IQMgBCADQiCIfCEEIANC/////w+DIBEgKH58IQMgBCADQiCIfCEEIANC/////w+DIBUgJH58IQMgBCADQiCIfCEEIANC/////w+DIBkgIH58IQMgBCADQiCIfCEEIANC/////w+DIB0gHH58IQMgBCADQiCIfCEEIANC/////w+DICEgGH58IQMgBCADQiCIfCEEIANC/////w+DICUgFH58IQMgBCADQiCIfCEEIANC/////w+DICkgEH58IQMgBCADQiCIfCEEIANC/////w+DIC0gDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AqAGIjEgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEwIANC/////w+DIAkgMH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AiwiM358IQQgAyAEQiCIfCEDIARC/////w+DIAogL358IQQgAyAEQiCIfCEDIARC/////w+DIA4gK358IQQgAyAEQiCIfCEDIARC/////w+DIBIgJ358IQQgAyAEQiCIfCEDIARC/////w+DIBYgI358IQQgAyAEQiCIfCEDIARC/////w+DIBogH358IQQgAyAEQiCIfCEDIARC/////w+DIB4gG358IQQgAyAEQiCIfCEDIARC/////w+DICIgF358IQQgAyAEQiCIfCEDIARC/////w+DICYgE358IQQgAyAEQiCIfCEDIARC/////w+DICogD358IQQgAyAEQiCIfCEDIARC/////w+DIC4gC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AiwiMiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgESAsfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAofnwhBCADIARCIIh8IQMgBEL/////D4MgGSAkfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgISAcfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgKSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgLSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCpAYiNSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DITQgBEL/////D4MgCSA0fnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAogM358IQMgBCADQiCIfCEEIANC/////w+DIA4gL358IQMgBCADQiCIfCEEIANC/////w+DIBIgK358IQMgBCADQiCIfCEEIANC/////w+DIBYgJ358IQMgBCADQiCIfCEEIANC/////w+DIBogI358IQMgBCADQiCIfCEEIANC/////w+DIB4gH358IQMgBCADQiCIfCEEIANC/////w+DICIgG358IQMgBCADQiCIfCEEIANC/////w+DICYgF358IQMgBCADQiCIfCEEIANC/////w+DICogE358IQMgBCADQiCIfCEEIANC/////w+DIC4gD358IQMgBCADQiCIfCEEIANC/////w+DIDIgC358IQMgBCADQiCIfCEEIANC/////w+DIA0gNH58IQMgBCADQiCIfCEEIANC/////w+DIBEgMH58IQMgBCADQiCIfCEEIANC/////w+DIBUgLH58IQMgBCADQiCIfCEEIANC/////w+DIBkgKH58IQMgBCADQiCIfCEEIANC/////w+DIB0gJH58IQMgBCADQiCIfCEEIANC/////w+DICEgIH58IQMgBCADQiCIfCEEIANC/////w+DICUgHH58IQMgBCADQiCIfCEEIANC/////w+DICkgGH58IQMgBCADQiCIfCEEIANC/////w+DIC0gFH58IQMgBCADQiCIfCEEIANC/////w+DIDEgEH58IQMgBCADQiCIfCEEIANC/////w+DIDUgDH58IQMgBCADQiCIfCEEIAIgAz4CACAEQiCIIQMgBEL/////D4MgDiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgEiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgFiArfnwhBCADIARCIIh8IQMgBEL/////D4MgGiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgHiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAffnwhBCADIARCIIh8IQMgBEL/////D4MgJiAbfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAXfnwhBCADIARCIIh8IQMgBEL/////D4MgLiATfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgESA0fnwhBCADIARCIIh8IQMgBEL/////D4MgFSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAsfnwhBCADIARCIIh8IQMgBEL/////D4MgHSAofnwhBCADIARCIIh8IQMgBEL/////D4MgISAkfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAgfnwhBCADIARCIIh8IQMgBEL/////D4MgKSAcfnwhBCADIARCIIh8IQMgBEL/////D4MgLSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgNSAQfnwhBCADIARCIIh8IQMgAiAEPgIEIANCIIghBCADQv////8PgyASIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIC9+fCEDIAQgA0IgiHwhBCADQv////8PgyAaICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAeICd+fCEDIAQgA0IgiHwhBCADQv////8PgyAiICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAmIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyAqIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAuIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAyIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIDR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIDB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdICx+fCEDIAQgA0IgiHwhBCADQv////8PgyAhICh+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICR+fCEDIAQgA0IgiHwhBCADQv////8PgyApICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAtIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAxIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyA1IBR+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIBYgM358IQQgAyAEQiCIfCEDIARC/////w+DIBogL358IQQgAyAEQiCIfCEDIARC/////w+DIB4gK358IQQgAyAEQiCIfCEDIARC/////w+DICIgJ358IQQgAyAEQiCIfCEDIARC/////w+DICYgI358IQQgAyAEQiCIfCEDIARC/////w+DICogH358IQQgAyAEQiCIfCEDIARC/////w+DIC4gG358IQQgAyAEQiCIfCEDIARC/////w+DIDIgF358IQQgAyAEQiCIfCEDIARC/////w+DIBkgNH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gMH58IQQgAyAEQiCIfCEDIARC/////w+DICEgLH58IQQgAyAEQiCIfCEDIARC/////w+DICUgKH58IQQgAyAEQiCIfCEDIARC/////w+DICkgJH58IQQgAyAEQiCIfCEDIARC/////w+DIC0gIH58IQQgAyAEQiCIfCEDIARC/////w+DIDEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIDUgGH58IQQgAyAEQiCIfCEDIAIgBD4CDCADQiCIIQQgA0L/////D4MgGiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAvfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiArfnwhAyAEIANCIIh8IQQgA0L/////D4MgJiAnfnwhAyAEIANCIIh8IQQgA0L/////D4MgKiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgLiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgMiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSA0fnwhAyAEIANCIIh8IQQgA0L/////D4MgISAwfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAsfnwhAyAEIANCIIh8IQQgA0L/////D4MgKSAofnwhAyAEIANCIIh8IQQgA0L/////D4MgLSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgMSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgNSAcfnwhAyAEIANCIIh8IQQgAiADPgIQIARCIIghAyAEQv////8PgyAeIDN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIC9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAmICt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAqICd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAuICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAyIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIDR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIDB+fCEEIAMgBEIgiHwhAyAEQv////8PgyApICx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAtICh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAxICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyA1ICB+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DICIgM358IQMgBCADQiCIfCEEIANC/////w+DICYgL358IQMgBCADQiCIfCEEIANC/////w+DICogK358IQMgBCADQiCIfCEEIANC/////w+DIC4gJ358IQMgBCADQiCIfCEEIANC/////w+DIDIgI358IQMgBCADQiCIfCEEIANC/////w+DICUgNH58IQMgBCADQiCIfCEEIANC/////w+DICkgMH58IQMgBCADQiCIfCEEIANC/////w+DIC0gLH58IQMgBCADQiCIfCEEIANC/////w+DIDEgKH58IQMgBCADQiCIfCEEIANC/////w+DIDUgJH58IQMgBCADQiCIfCEEIAIgAz4CGCAEQiCIIQMgBEL/////D4MgJiAzfnwhBCADIARCIIh8IQMgBEL/////D4MgKiAvfnwhBCADIARCIIh8IQMgBEL/////D4MgLiArfnwhBCADIARCIIh8IQMgBEL/////D4MgMiAnfnwhBCADIARCIIh8IQMgBEL/////D4MgKSA0fnwhBCADIARCIIh8IQMgBEL/////D4MgLSAwfnwhBCADIARCIIh8IQMgBEL/////D4MgMSAsfnwhBCADIARCIIh8IQMgBEL/////D4MgNSAofnwhBCADIARCIIh8IQMgAiAEPgIcIANCIIghBCADQv////8PgyAqIDN+fCEDIAQgA0IgiHwhBCADQv////8PgyAuIC9+fCEDIAQgA0IgiHwhBCADQv////8PgyAyICt+fCEDIAQgA0IgiHwhBCADQv////8PgyAtIDR+fCEDIAQgA0IgiHwhBCADQv////8PgyAxIDB+fCEDIAQgA0IgiHwhBCADQv////8PgyA1ICx+fCEDIAQgA0IgiHwhBCACIAM+AiAgBEIgiCEDIARC/////w+DIC4gM358IQQgAyAEQiCIfCEDIARC/////w+DIDIgL358IQQgAyAEQiCIfCEDIARC/////w+DIDEgNH58IQQgAyAEQiCIfCEDIARC/////w+DIDUgMH58IQQgAyAEQiCIfCEDIAIgBD4CJCADQiCIIQQgA0L/////D4MgMiAzfnwhAyAEIANCIIh8IQQgA0L/////D4MgNSA0fnwhAyAEIANCIIh8IQQgAiADPgIoIARCIIghAyACIAQ+AiwgA6cEQCACQfgFIAIQBxoFIAJB+AUQBQRAIAJB+AUgAhAHGgsLC81BKQF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX5C/f/z/w8hBkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQggAkL/////D4NBADUC+AUiCSAIfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCBCIKfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DQQA1AvwFIgwgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyELIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AggiDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKABiIPIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhDiACQv////8PgyAJIA5+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIMIhB+fCECIAMgAkIgiHwhAyACQv////8PgyAKIA1+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUChAYiEiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIREgAkL/////D4MgCSARfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCECITfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgDSANfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgEX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gDn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AogGIhUgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEUIAJC/////w+DIAkgFH58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhQiFn58IQIgAyACQiCIfCEDIAJC/////w+DIAogE358IQIgAyACQiCIfCEDIAJC/////w+DIA0gEH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBF+fCECIAMgAkIgiHwhAyACQv////8PgyASIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAVIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKMBiIYIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhFyACQv////8PgyAJIBd+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIYIhl+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyANIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAQIBB+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiARfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCkAYiGyAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRogAkL/////D4MgCSAafnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCHCIcfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgECATfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgGn58IQIgAyACQiCIfCEDIAJC/////w+DIA8gF358IQIgAyACQiCIfCEDIAJC/////w+DIBIgFH58IQIgAyACQiCIfCEDIAJC/////w+DIBUgEX58IQIgAyACQiCIfCEDIAJC/////w+DIBggDn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1ApQGIh4gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEdIAJC/////w+DIAkgHX58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AiAiH358IQIgAyACQiCIfCEDIAJC/////w+DIAogHH58IQIgAyACQiCIfCEDIAJC/////w+DIA0gGX58IQIgAyACQiCIfCEDIAJC/////w+DIBAgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBMgE358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBp+fCECIAMgAkIgiHwhAyACQv////8PgyASIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAbIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAeIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKYBiIhIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhICACQv////8PgyAJICB+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIkIiJ+fCECIAMgAkIgiHwhAyACQv////8PgyAKIB9+fCECIAMgAkIgiHwhAyACQv////8PgyANIBx+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBl+fCECIAMgAkIgiHwhAyACQv////8PgyATIBZ+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAgfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAdfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAafnwhAiADIAJCIIh8IQMgAkL/////D4MgFSAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyARfnwhAiADIAJCIIh8IQMgAkL/////D4MgHiAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgISALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCnAYiJCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DISMgAkL/////D4MgCSAjfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCKCIlfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiAifnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAffnwhAiADIAJCIIh8IQMgAkL/////D4MgECAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAZfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgFiAWfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgI358IQIgAyACQiCIfCEDIAJC/////w+DIA8gIH58IQIgAyACQiCIfCEDIAJC/////w+DIBIgHX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgGn58IQIgAyACQiCIfCEDIAJC/////w+DIBggF358IQIgAyACQiCIfCEDIAJC/////w+DIBsgFH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gEX58IQIgAyACQiCIfCEDIAJC/////w+DICEgDn58IQIgAyACQiCIfCEDIAJC/////w+DICQgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AqAGIicgCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEmIAJC/////w+DIAkgJn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AiwiKH58IQIgAyACQiCIfCEDIAJC/////w+DIAogJX58IQIgAyACQiCIfCEDIAJC/////w+DIA0gIn58IQIgAyACQiCIfCEDIAJC/////w+DIBAgH358IQIgAyACQiCIfCEDIAJC/////w+DIBMgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBYgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMICZ+fCECIAMgAkIgiHwhAyACQv////8PgyAPICN+fCECIAMgAkIgiHwhAyACQv////8PgyASICB+fCECIAMgAkIgiHwhAyACQv////8PgyAVIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAhIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAkIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAnIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQKkBiIqIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhKSACQv////8PgyAJICl+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgCiAofnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgECAifnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAffnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgGSAZfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgKX58IQIgAyACQiCIfCEDIAJC/////w+DIA8gJn58IQIgAyACQiCIfCEDIAJC/////w+DIBIgI358IQIgAyACQiCIfCEDIAJC/////w+DIBUgIH58IQIgAyACQiCIfCEDIAJC/////w+DIBggHX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgGn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gF358IQIgAyACQiCIfCEDIAJC/////w+DICEgFH58IQIgAyACQiCIfCEDIAJC/////w+DICQgEX58IQIgAyACQiCIfCEDIAJC/////w+DICcgDn58IQIgAyACQiCIfCEDIAJC/////w+DICogC358IQIgAyACQiCIfCEDIAEgAj4CACADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgDSAofnwhAiADIAJCIIh8IQMgAkL/////D4MgECAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAifnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAffnwhAiADIAJCIIh8IQMgAkL/////D4MgGSAcfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIA8gKX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgJn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgI358IQIgAyACQiCIfCEDIAJC/////w+DIBggIH58IQIgAyACQiCIfCEDIAJC/////w+DIBsgHX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gGn58IQIgAyACQiCIfCEDIAJC/////w+DICEgF358IQIgAyACQiCIfCEDIAJC/////w+DICQgFH58IQIgAyACQiCIfCEDIAJC/////w+DICcgEX58IQIgAyACQiCIfCEDIAJC/////w+DICogDn58IQIgAyACQiCIfCEDIAEgAj4CBCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgECAofnwhAiADIAJCIIh8IQMgAkL/////D4MgEyAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAifnwhAiADIAJCIIh8IQMgAkL/////D4MgGSAffnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgHCAcfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBIgKX58IQIgAyACQiCIfCEDIAJC/////w+DIBUgJn58IQIgAyACQiCIfCEDIAJC/////w+DIBggI358IQIgAyACQiCIfCEDIAJC/////w+DIBsgIH58IQIgAyACQiCIfCEDIAJC/////w+DIB4gHX58IQIgAyACQiCIfCEDIAJC/////w+DICEgGn58IQIgAyACQiCIfCEDIAJC/////w+DICQgF358IQIgAyACQiCIfCEDIAJC/////w+DICcgFH58IQIgAyACQiCIfCEDIAJC/////w+DICogEX58IQIgAyACQiCIfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgEyAofnwhAiADIAJCIIh8IQMgAkL/////D4MgFiAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgGSAifnwhAiADIAJCIIh8IQMgAkL/////D4MgHCAffnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBUgKX58IQIgAyACQiCIfCEDIAJC/////w+DIBggJn58IQIgAyACQiCIfCEDIAJC/////w+DIBsgI358IQIgAyACQiCIfCEDIAJC/////w+DIB4gIH58IQIgAyACQiCIfCEDIAJC/////w+DICEgHX58IQIgAyACQiCIfCEDIAJC/////w+DICQgGn58IQIgAyACQiCIfCEDIAJC/////w+DICcgF358IQIgAyACQiCIfCEDIAJC/////w+DICogFH58IQIgAyACQiCIfCEDIAEgAj4CDCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgFiAofnwhAiADIAJCIIh8IQMgAkL/////D4MgGSAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgHCAifnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgHyAffnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBggKX58IQIgAyACQiCIfCEDIAJC/////w+DIBsgJn58IQIgAyACQiCIfCEDIAJC/////w+DIB4gI358IQIgAyACQiCIfCEDIAJC/////w+DICEgIH58IQIgAyACQiCIfCEDIAJC/////w+DICQgHX58IQIgAyACQiCIfCEDIAJC/////w+DICcgGn58IQIgAyACQiCIfCEDIAJC/////w+DICogF358IQIgAyACQiCIfCEDIAEgAj4CECADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgGSAofnwhAiADIAJCIIh8IQMgAkL/////D4MgHCAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgHyAifnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIBsgKX58IQIgAyACQiCIfCEDIAJC/////w+DIB4gJn58IQIgAyACQiCIfCEDIAJC/////w+DICEgI358IQIgAyACQiCIfCEDIAJC/////w+DICQgIH58IQIgAyACQiCIfCEDIAJC/////w+DICcgHX58IQIgAyACQiCIfCEDIAJC/////w+DICogGn58IQIgAyACQiCIfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgHCAofnwhAiADIAJCIIh8IQMgAkL/////D4MgHyAlfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgIiAifnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIB4gKX58IQIgAyACQiCIfCEDIAJC/////w+DICEgJn58IQIgAyACQiCIfCEDIAJC/////w+DICQgI358IQIgAyACQiCIfCEDIAJC/////w+DICcgIH58IQIgAyACQiCIfCEDIAJC/////w+DICogHX58IQIgAyACQiCIfCEDIAEgAj4CGCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgHyAofnwhAiADIAJCIIh8IQMgAkL/////D4MgIiAlfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DICEgKX58IQIgAyACQiCIfCEDIAJC/////w+DICQgJn58IQIgAyACQiCIfCEDIAJC/////w+DICcgI358IQIgAyACQiCIfCEDIAJC/////w+DICogIH58IQIgAyACQiCIfCEDIAEgAj4CHCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgIiAofnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgJSAlfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DICQgKX58IQIgAyACQiCIfCEDIAJC/////w+DICcgJn58IQIgAyACQiCIfCEDIAJC/////w+DICogI358IQIgAyACQiCIfCEDIAEgAj4CICADIQQgBEIgiCEF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QgA3AwggAEIANwMQIABCADcDGAtHACAAKQMYIAEpAxhRBEAgACkDECABKQMQUQRAIAApAwggASkDCFEEQCAAKQMAIAEpAwBRDwVBAA8LBUEADwsFQQAPC0EADwt9ACAAKQMYIAEpAxhUBEBBAA8FIAApAxggASkDGFYEQEEBDwUgACkDECABKQMQVARAQQAPBSAAKQMQIAEpAxBWBEBBAQ8FIAApAwggASkDCFQEQEEADwUgACkDCCABKQMIVgRAQQEPBSAAKQMAIAEpAwBaDwsLCwsLC0EADwvUAQEBfiAANQIAIAE1AgB8IQMgAiADPgIAIAA1AgQgATUCBHwgA0IgiHwhAyACIAM+AgQgADUCCCABNQIIfCADQiCIfCEDIAIgAz4CCCAANQIMIAE1Agx8IANCIIh8IQMgAiADPgIMIAA1AhAgATUCEHwgA0IgiHwhAyACIAM+AhAgADUCFCABNQIUfCADQiCIfCEDIAIgAz4CFCAANQIYIAE1Ahh8IANCIIh8IQMgAiADPgIYIAA1AhwgATUCHHwgA0IgiHwhAyACIAM+AhwgA0IgiKcLjAIBAX4gADUCACABNQIAfSEDIAIgA0L/////D4M+AgAgADUCBCABNQIEfSADQiCHfCEDIAIgA0L/////D4M+AgQgADUCCCABNQIIfSADQiCHfCEDIAIgA0L/////D4M+AgggADUCDCABNQIMfSADQiCHfCEDIAIgA0L/////D4M+AgwgADUCECABNQIQfSADQiCHfCEDIAIgA0L/////D4M+AhAgADUCFCABNQIUfSADQiCHfCEDIAIgA0L/////D4M+AhQgADUCGCABNQIYfSADQiCHfCEDIAIgA0L/////D4M+AhggADUCHCABNQIcfSADQiCHfCEDIAIgA0L/////D4M+AhwgA0Igh6cLjxASAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+IANC/////w+DIAA1AgAiBSABNQIAIgZ+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIAUgATUCBCIIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCBCIHIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgQgA0IgiCEEIANC/////w+DIAUgATUCCCIKfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCCCIJIAZ+fCEDIAQgA0IgiHwhBCACIAM+AgggBEIgiCEDIARC/////w+DIAUgATUCDCIMfnwhBCADIARCIIh8IQMgBEL/////D4MgByAKfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCILIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIAUgATUCECIOfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCECINIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhAgBEIgiCEDIARC/////w+DIAUgATUCFCIQfnwhBCADIARCIIh8IQMgBEL/////D4MgByAOfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCFCIPIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhQgA0IgiCEEIANC/////w+DIAUgATUCGCISfnwhAyAEIANCIIh8IQQgA0L/////D4MgByAQfnwhAyAEIANCIIh8IQQgA0L/////D4MgCSAOfnwhAyAEIANCIIh8IQQgA0L/////D4MgCyAMfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAKfnwhAyAEIANCIIh8IQQgA0L/////D4MgDyAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIRIAZ+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIARC/////w+DIAUgATUCHCIUfnwhBCADIARCIIh8IQMgBEL/////D4MgByASfnwhBCADIARCIIh8IQMgBEL/////D4MgCSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgCyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAMfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAKfnwhBCADIARCIIh8IQMgBEL/////D4MgESAIfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCHCITIAZ+fCEEIAMgBEIgiHwhAyACIAQ+AhwgA0IgiCEEIANC/////w+DIAcgFH58IQMgBCADQiCIfCEEIANC/////w+DIAkgEn58IQMgBCADQiCIfCEEIANC/////w+DIAsgEH58IQMgBCADQiCIfCEEIANC/////w+DIA0gDn58IQMgBCADQiCIfCEEIANC/////w+DIA8gDH58IQMgBCADQiCIfCEEIANC/////w+DIBEgCn58IQMgBCADQiCIfCEEIANC/////w+DIBMgCH58IQMgBCADQiCIfCEEIAIgAz4CICAEQiCIIQMgBEL/////D4MgCSAUfnwhBCADIARCIIh8IQMgBEL/////D4MgCyASfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgDyAOfnwhBCADIARCIIh8IQMgBEL/////D4MgESAMfnwhBCADIARCIIh8IQMgBEL/////D4MgEyAKfnwhBCADIARCIIh8IQMgAiAEPgIkIANCIIghBCADQv////8PgyALIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBJ+fCEDIAQgA0IgiHwhBCADQv////8PgyAPIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyARIA5+fCEDIAQgA0IgiHwhBCADQv////8PgyATIAx+fCEDIAQgA0IgiHwhBCACIAM+AiggBEIgiCEDIARC/////w+DIA0gFH58IQQgAyAEQiCIfCEDIARC/////w+DIA8gEn58IQQgAyAEQiCIfCEDIARC/////w+DIBEgEH58IQQgAyAEQiCIfCEDIARC/////w+DIBMgDn58IQQgAyAEQiCIfCEDIAIgBD4CLCADQiCIIQQgA0L/////D4MgDyAUfnwhAyAEIANCIIh8IQQgA0L/////D4MgESASfnwhAyAEIANCIIh8IQQgA0L/////D4MgEyAQfnwhAyAEIANCIIh8IQQgAiADPgIwIARCIIghAyAEQv////8PgyARIBR+fCEEIAMgBEIgiHwhAyAEQv////8PgyATIBJ+fCEEIAMgBEIgiHwhAyACIAQ+AjQgA0IgiCEEIANC/////w+DIBMgFH58IQMgBCADQiCIfCEEIAIgAz4COCAEQiCIIQMgAiAEPgI8C4wSDAF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAA1AgAiBiAGfnwhAiADIAJCIIh8IQMgASACPgIAIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AgQiB358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCCCIIfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgByAHfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CCCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIMIgl+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAh+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIMIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhAiCn58IQIgAyACQiCIfCEDIAJC/////w+DIAcgCX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAggCH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAYgADUCFCILfnwhAiADIAJCIIh8IQMgAkL/////D4MgByAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgCCAJfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAEgAj4CFCADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgBiAANQIYIgx+fCECIAMgAkIgiHwhAyACQv////8PgyAHIAt+fCECIAMgAkIgiHwhAyACQv////8PgyAIIAp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAJIAl+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgASACPgIYIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAGIAA1AhwiDX58IQIgAyACQiCIfCEDIAJC/////w+DIAcgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAggC358IQIgAyACQiCIfCEDIAJC/////w+DIAkgCn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AhwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAggDH58IQIgAyACQiCIfCEDIAJC/////w+DIAkgC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAogCn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAggDX58IQIgAyACQiCIfCEDIAJC/////w+DIAkgDH58IQIgAyACQiCIfCEDIAJC/////w+DIAogC358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAkgDX58IQIgAyACQiCIfCEDIAJC/////w+DIAogDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAsgC358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DIAsgDH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AiwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAsgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIAwgDH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAwgDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIA0gDX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyABIAI+AjggAyEEIARCIIghBSABIAQ+AjwLCgAgACAAIAEQLQu2AQEBfiAANQAAIAF+IQMgAiADPgAAIAA1AAQgAX4gA0IgiHwhAyACIAM+AAQgADUACCABfiADQiCIfCEDIAIgAz4ACCAANQAMIAF+IANCIIh8IQMgAiADPgAMIAA1ABAgAX4gA0IgiHwhAyACIAM+ABAgADUAFCABfiADQiCIfCEDIAIgAz4AFCAANQAYIAF+IANCIIh8IQMgAiADPgAYIAA1ABwgAX4gA0IgiHwhAyACIAM+ABwLTgIBfgF/IAAhAyADNQAAIAF8IQIgAyACPgAAIAJCIIghAgJAA0AgAlANASADQQRqIQMgAzUAACACfCECIAMgAj4AACACQiCIIQIMAAsLC7ACBwF/AX8BfwF/AX4BfgF/IAIEQCACIQUFQZgZIQULIAMEQCADIQQFQbgZIQQLIAAgBBAlIAFB+BgQJSAFECZB2BkQJkEfIQZBHyEHAkADQEH4GCAHai0AACAHQQNGcg0BIAdBAWshBwwACwtB+BggB2pBA2s1AABCAXwhCCAIQgFRBEBCAEIAgBoLAkADQAJAA0AgBCAGai0AACAGQQdGcg0BIAZBAWshBgwACwsgBCAGakEHaykAACEJIAkgCIAhCSAGIAdrQQRrIQoCQANAIAlCgICAgHCDUCAKQQBOcQ0BIAlCCIghCSAKQQFqIQoMAAsLIAlQBEAgBEH4GBAqRQ0CQgEhCUEAIQoLQfgYIAlB+BkQMCAEQfgZIAprIAQQLBogBSAKaiAJEDEMAAsLC7UCCwF/AX8BfwF/AX8BfwF/AX8BfwF/AX9BmBohA0GYGhAmQQAhC0G4GiEFIAFBuBoQJUHYGiEEQdgaEChBACEMQfgaIQggAEH4GhAlQZgbIQZBuBshB0GYHCEKAkADQCAIECcNASAFIAggBiAHEDIgBiAEQdgbEC0gCwRAIAwEQEHYGyADECoEQEHYGyADIAoQLBpBACENBSADQdgbIAoQLBpBASENCwVB2BsgAyAKECsaQQEhDQsFIAwEQEHYGyADIAoQKxpBACENBSADQdgbECoEQCADQdgbIAoQLBpBACENBUHYGyADIAoQLBpBASENCwsLIAMhCSAEIQMgCiEEIAkhCiAMIQsgDSEMIAUhCSAIIQUgByEIIAkhBwwACwsgCwRAIAEgAyACECwaBSADIAIQJQsLCgAgAEGYHRApDwssACAAIAEgAhArBEAgAkG4HCACECwaBSACQbgcECoEQCACQbgcIAIQLBoLCwsXACAAIAEgAhAsBEAgAkG4HCACECsaCwsLAEG4HSAAIAEQNgucEQMBfgF+AX5C/////w8hAkIAIQMgADUCACACfkL/////D4MhBCAANQIAIANCIIh8QbgcNQIAIAR+fCEDIAAgAz4CACAANQIEIANCIIh8QbgcNQIEIAR+fCEDIAAgAz4CBCAANQIIIANCIIh8QbgcNQIIIAR+fCEDIAAgAz4CCCAANQIMIANCIIh8QbgcNQIMIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QbgcNQIQIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QbgcNQIUIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QbgcNQIYIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QbgcNQIcIAR+fCEDIAAgAz4CHEGYHyADQiCIPgIAQgAhAyAANQIEIAJ+Qv////8PgyEEIAA1AgQgA0IgiHxBuBw1AgAgBH58IQMgACADPgIEIAA1AgggA0IgiHxBuBw1AgQgBH58IQMgACADPgIIIAA1AgwgA0IgiHxBuBw1AgggBH58IQMgACADPgIMIAA1AhAgA0IgiHxBuBw1AgwgBH58IQMgACADPgIQIAA1AhQgA0IgiHxBuBw1AhAgBH58IQMgACADPgIUIAA1AhggA0IgiHxBuBw1AhQgBH58IQMgACADPgIYIAA1AhwgA0IgiHxBuBw1AhggBH58IQMgACADPgIcIAA1AiAgA0IgiHxBuBw1AhwgBH58IQMgACADPgIgQZgfIANCIIg+AgRCACEDIAA1AgggAn5C/////w+DIQQgADUCCCADQiCIfEG4HDUCACAEfnwhAyAAIAM+AgggADUCDCADQiCIfEG4HDUCBCAEfnwhAyAAIAM+AgwgADUCECADQiCIfEG4HDUCCCAEfnwhAyAAIAM+AhAgADUCFCADQiCIfEG4HDUCDCAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEG4HDUCECAEfnwhAyAAIAM+AhggADUCHCADQiCIfEG4HDUCFCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEG4HDUCGCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEG4HDUCHCAEfnwhAyAAIAM+AiRBmB8gA0IgiD4CCEIAIQMgADUCDCACfkL/////D4MhBCAANQIMIANCIIh8QbgcNQIAIAR+fCEDIAAgAz4CDCAANQIQIANCIIh8QbgcNQIEIAR+fCEDIAAgAz4CECAANQIUIANCIIh8QbgcNQIIIAR+fCEDIAAgAz4CFCAANQIYIANCIIh8QbgcNQIMIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QbgcNQIQIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QbgcNQIUIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QbgcNQIYIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QbgcNQIcIAR+fCEDIAAgAz4CKEGYHyADQiCIPgIMQgAhAyAANQIQIAJ+Qv////8PgyEEIAA1AhAgA0IgiHxBuBw1AgAgBH58IQMgACADPgIQIAA1AhQgA0IgiHxBuBw1AgQgBH58IQMgACADPgIUIAA1AhggA0IgiHxBuBw1AgggBH58IQMgACADPgIYIAA1AhwgA0IgiHxBuBw1AgwgBH58IQMgACADPgIcIAA1AiAgA0IgiHxBuBw1AhAgBH58IQMgACADPgIgIAA1AiQgA0IgiHxBuBw1AhQgBH58IQMgACADPgIkIAA1AiggA0IgiHxBuBw1AhggBH58IQMgACADPgIoIAA1AiwgA0IgiHxBuBw1AhwgBH58IQMgACADPgIsQZgfIANCIIg+AhBCACEDIAA1AhQgAn5C/////w+DIQQgADUCFCADQiCIfEG4HDUCACAEfnwhAyAAIAM+AhQgADUCGCADQiCIfEG4HDUCBCAEfnwhAyAAIAM+AhggADUCHCADQiCIfEG4HDUCCCAEfnwhAyAAIAM+AhwgADUCICADQiCIfEG4HDUCDCAEfnwhAyAAIAM+AiAgADUCJCADQiCIfEG4HDUCECAEfnwhAyAAIAM+AiQgADUCKCADQiCIfEG4HDUCFCAEfnwhAyAAIAM+AiggADUCLCADQiCIfEG4HDUCGCAEfnwhAyAAIAM+AiwgADUCMCADQiCIfEG4HDUCHCAEfnwhAyAAIAM+AjBBmB8gA0IgiD4CFEIAIQMgADUCGCACfkL/////D4MhBCAANQIYIANCIIh8QbgcNQIAIAR+fCEDIAAgAz4CGCAANQIcIANCIIh8QbgcNQIEIAR+fCEDIAAgAz4CHCAANQIgIANCIIh8QbgcNQIIIAR+fCEDIAAgAz4CICAANQIkIANCIIh8QbgcNQIMIAR+fCEDIAAgAz4CJCAANQIoIANCIIh8QbgcNQIQIAR+fCEDIAAgAz4CKCAANQIsIANCIIh8QbgcNQIUIAR+fCEDIAAgAz4CLCAANQIwIANCIIh8QbgcNQIYIAR+fCEDIAAgAz4CMCAANQI0IANCIIh8QbgcNQIcIAR+fCEDIAAgAz4CNEGYHyADQiCIPgIYQgAhAyAANQIcIAJ+Qv////8PgyEEIAA1AhwgA0IgiHxBuBw1AgAgBH58IQMgACADPgIcIAA1AiAgA0IgiHxBuBw1AgQgBH58IQMgACADPgIgIAA1AiQgA0IgiHxBuBw1AgggBH58IQMgACADPgIkIAA1AiggA0IgiHxBuBw1AgwgBH58IQMgACADPgIoIAA1AiwgA0IgiHxBuBw1AhAgBH58IQMgACADPgIsIAA1AjAgA0IgiHxBuBw1AhQgBH58IQMgACADPgIwIAA1AjQgA0IgiHxBuBw1AhggBH58IQMgACADPgI0IAA1AjggA0IgiHxBuBw1AhwgBH58IQMgACADPgI4QZgfIANCIIg+AhxBmB8gAEEgaiABEDULvh8jAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL/////DyEFIANC/////w+DIAA1AgAiBiABNQIAIgd+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhCCADQv////8Pg0EANQK4HCIJIAh+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIEIgt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIEIgogB358IQQgAyAEQiCIfCEDIARC/////w+DQQA1ArwcIg0gCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEMIARC/////w+DIAkgDH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAGIAE1AggiD358IQMgBCADQiCIfCEEIANC/////w+DIAogC358IQMgBCADQiCIfCEEIANC/////w+DIAA1AggiDiAHfnwhAyAEIANCIIh8IQQgA0L/////D4MgDSAMfnwhAyAEIANCIIh8IQQgA0L/////D4NBADUCwBwiESAIfnwhAyAEIANCIIh8IQQgA0L/////D4MgBX5C/////w+DIRAgA0L/////D4MgCSAQfnwhAyAEIANCIIh8IQQgBEIgiCEDIARC/////w+DIAYgATUCDCITfnwhBCADIARCIIh8IQMgBEL/////D4MgCiAPfnwhBCADIARCIIh8IQMgBEL/////D4MgDiALfnwhBCADIARCIIh8IQMgBEL/////D4MgADUCDCISIAd+fCEEIAMgBEIgiHwhAyAEQv////8PgyANIBB+fCEEIAMgBEIgiHwhAyAEQv////8PgyARIAx+fCEEIAMgBEIgiHwhAyAEQv////8Pg0EANQLEHCIVIAh+fCEEIAMgBEIgiHwhAyAEQv////8PgyAFfkL/////D4MhFCAEQv////8PgyAJIBR+fCEEIAMgBEIgiHwhAyADQiCIIQQgA0L/////D4MgBiABNQIQIhd+fCEDIAQgA0IgiHwhBCADQv////8PgyAKIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyAANQIQIhYgB358IQMgBCADQiCIfCEEIANC/////w+DIA0gFH58IQMgBCADQiCIfCEEIANC/////w+DIBEgEH58IQMgBCADQiCIfCEEIANC/////w+DIBUgDH58IQMgBCADQiCIfCEEIANC/////w+DQQA1AsgcIhkgCH58IQMgBCADQiCIfCEEIANC/////w+DIAV+Qv////8PgyEYIANC/////w+DIAkgGH58IQMgBCADQiCIfCEEIARCIIghAyAEQv////8PgyAGIAE1AhQiG358IQQgAyAEQiCIfCEDIARC/////w+DIAogF358IQQgAyAEQiCIfCEDIARC/////w+DIA4gE358IQQgAyAEQiCIfCEDIARC/////w+DIBIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBYgC358IQQgAyAEQiCIfCEDIARC/////w+DIAA1AhQiGiAHfnwhBCADIARCIIh8IQMgBEL/////D4MgDSAYfnwhBCADIARCIIh8IQMgBEL/////D4MgESAUfnwhBCADIARCIIh8IQMgBEL/////D4MgFSAQfnwhBCADIARCIIh8IQMgBEL/////D4MgGSAMfnwhBCADIARCIIh8IQMgBEL/////D4NBADUCzBwiHSAIfnwhBCADIARCIIh8IQMgBEL/////D4MgBX5C/////w+DIRwgBEL/////D4MgCSAcfnwhBCADIARCIIh8IQMgA0IgiCEEIANC/////w+DIAYgATUCGCIffnwhAyAEIANCIIh8IQQgA0L/////D4MgCiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgDiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgEiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAPfnwhAyAEIANCIIh8IQQgA0L/////D4MgGiALfnwhAyAEIANCIIh8IQQgA0L/////D4MgADUCGCIeIAd+fCEDIAQgA0IgiHwhBCADQv////8PgyANIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyARIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIAx+fCEDIAQgA0IgiHwhBCADQv////8Pg0EANQLQHCIhIAh+fCEDIAQgA0IgiHwhBCADQv////8PgyAFfkL/////D4MhICADQv////8PgyAJICB+fCEDIAQgA0IgiHwhBCAEQiCIIQMgBEL/////D4MgBiABNQIcIiN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAKIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAOIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyASIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAWIBN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIA9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIAt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAANQIcIiIgB358IQQgAyAEQiCIfCEDIARC/////w+DIA0gIH58IQQgAyAEQiCIfCEDIARC/////w+DIBEgHH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgGH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgFH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gEH58IQQgAyAEQiCIfCEDIARC/////w+DICEgDH58IQQgAyAEQiCIfCEDIARC/////w+DQQA1AtQcIiUgCH58IQQgAyAEQiCIfCEDIARC/////w+DIAV+Qv////8PgyEkIARC/////w+DIAkgJH58IQQgAyAEQiCIfCEDIANCIIghBCADQv////8PgyAKICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAOIB9+fCEDIAQgA0IgiHwhBCADQv////8PgyASIBt+fCEDIAQgA0IgiHwhBCADQv////8PgyAWIBd+fCEDIAQgA0IgiHwhBCADQv////8PgyAaIBN+fCEDIAQgA0IgiHwhBCADQv////8PgyAeIA9+fCEDIAQgA0IgiHwhBCADQv////8PgyAiIAt+fCEDIAQgA0IgiHwhBCADQv////8PgyANICR+fCEDIAQgA0IgiHwhBCADQv////8PgyARICB+fCEDIAQgA0IgiHwhBCADQv////8PgyAVIBx+fCEDIAQgA0IgiHwhBCADQv////8PgyAZIBh+fCEDIAQgA0IgiHwhBCADQv////8PgyAdIBR+fCEDIAQgA0IgiHwhBCADQv////8PgyAhIBB+fCEDIAQgA0IgiHwhBCADQv////8PgyAlIAx+fCEDIAQgA0IgiHwhBCACIAM+AgAgBEIgiCEDIARC/////w+DIA4gI358IQQgAyAEQiCIfCEDIARC/////w+DIBIgH358IQQgAyAEQiCIfCEDIARC/////w+DIBYgG358IQQgAyAEQiCIfCEDIARC/////w+DIBogF358IQQgAyAEQiCIfCEDIARC/////w+DIB4gE358IQQgAyAEQiCIfCEDIARC/////w+DICIgD358IQQgAyAEQiCIfCEDIARC/////w+DIBEgJH58IQQgAyAEQiCIfCEDIARC/////w+DIBUgIH58IQQgAyAEQiCIfCEDIARC/////w+DIBkgHH58IQQgAyAEQiCIfCEDIARC/////w+DIB0gGH58IQQgAyAEQiCIfCEDIARC/////w+DICEgFH58IQQgAyAEQiCIfCEDIARC/////w+DICUgEH58IQQgAyAEQiCIfCEDIAIgBD4CBCADQiCIIQQgA0L/////D4MgEiAjfnwhAyAEIANCIIh8IQQgA0L/////D4MgFiAffnwhAyAEIANCIIh8IQQgA0L/////D4MgGiAbfnwhAyAEIANCIIh8IQQgA0L/////D4MgHiAXfnwhAyAEIANCIIh8IQQgA0L/////D4MgIiATfnwhAyAEIANCIIh8IQQgA0L/////D4MgFSAkfnwhAyAEIANCIIh8IQQgA0L/////D4MgGSAgfnwhAyAEIANCIIh8IQQgA0L/////D4MgHSAcfnwhAyAEIANCIIh8IQQgA0L/////D4MgISAYfnwhAyAEIANCIIh8IQQgA0L/////D4MgJSAUfnwhAyAEIANCIIh8IQQgAiADPgIIIARCIIghAyAEQv////8PgyAWICN+fCEEIAMgBEIgiHwhAyAEQv////8PgyAaIB9+fCEEIAMgBEIgiHwhAyAEQv////8PgyAeIBt+fCEEIAMgBEIgiHwhAyAEQv////8PgyAiIBd+fCEEIAMgBEIgiHwhAyAEQv////8PgyAZICR+fCEEIAMgBEIgiHwhAyAEQv////8PgyAdICB+fCEEIAMgBEIgiHwhAyAEQv////8PgyAhIBx+fCEEIAMgBEIgiHwhAyAEQv////8PgyAlIBh+fCEEIAMgBEIgiHwhAyACIAQ+AgwgA0IgiCEEIANC/////w+DIBogI358IQMgBCADQiCIfCEEIANC/////w+DIB4gH358IQMgBCADQiCIfCEEIANC/////w+DICIgG358IQMgBCADQiCIfCEEIANC/////w+DIB0gJH58IQMgBCADQiCIfCEEIANC/////w+DICEgIH58IQMgBCADQiCIfCEEIANC/////w+DICUgHH58IQMgBCADQiCIfCEEIAIgAz4CECAEQiCIIQMgBEL/////D4MgHiAjfnwhBCADIARCIIh8IQMgBEL/////D4MgIiAffnwhBCADIARCIIh8IQMgBEL/////D4MgISAkfnwhBCADIARCIIh8IQMgBEL/////D4MgJSAgfnwhBCADIARCIIh8IQMgAiAEPgIUIANCIIghBCADQv////8PgyAiICN+fCEDIAQgA0IgiHwhBCADQv////8PgyAlICR+fCEDIAQgA0IgiHwhBCACIAM+AhggBEIgiCEDIAIgBD4CHCADpwRAIAJBuBwgAhAsGgUgAkG4HBAqBEAgAkG4HCACECwaCwsLuyEdAX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfgF+AX4BfkL/////DyEGQgAhAkIAIQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgADUCACIHIAd+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhCCACQv////8Pg0EANQK4HCIJIAh+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIEIgp+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4NBADUCvBwiDCAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIQsgAkL/////D4MgCSALfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCCCINfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgCiAKfnwhAiADIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AsAcIg8gCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEOIAJC/////w+DIAkgDn58IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AgwiEH58IQIgAyACQiCIfCEDIAJC/////w+DIAogDX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAPIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLEHCISIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhESACQv////8PgyAJIBF+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIQIhN+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBB+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyANIA1+fCECIAMgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCARfnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUCyBwiFSAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIRQgAkL/////D4MgCSAUfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAcgADUCFCIWfnwhAiADIAJCIIh8IQMgAkL/////D4MgCiATfnwhAiADIAJCIIh8IQMgAkL/////D4MgDSAQfnwhAiADIAJCIIh8IQMgAkL/////D4NCAYYhAiADQgGGIAJCIIh8IQMgAkL/////D4MgBEL/////D4N8IQIgAyACQiCIfCAFfCEDIAJC/////w+DIAwgFH58IQIgAyACQiCIfCEDIAJC/////w+DIA8gEX58IQIgAyACQiCIfCEDIAJC/////w+DIBIgDn58IQIgAyACQiCIfCEDIAJC/////w+DIBUgC358IQIgAyACQiCIfCEDIAJC/////w+DQQA1AswcIhggCH58IQIgAyACQiCIfCEDIAJC/////w+DIAZ+Qv////8PgyEXIAJC/////w+DIAkgF358IQIgAyACQiCIfCEDIAMhBCAEQiCIIQVCACECQgAhAyACQv////8PgyAHIAA1AhgiGX58IQIgAyACQiCIfCEDIAJC/////w+DIAogFn58IQIgAyACQiCIfCEDIAJC/////w+DIA0gE358IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBAgEH58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBR+fCECIAMgAkIgiHwhAyACQv////8PgyASIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAVIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAYIAt+fCECIAMgAkIgiHwhAyACQv////8Pg0EANQLQHCIbIAh+fCECIAMgAkIgiHwhAyACQv////8PgyAGfkL/////D4MhGiACQv////8PgyAJIBp+fCECIAMgAkIgiHwhAyADIQQgBEIgiCEFQgAhAkIAIQMgAkL/////D4MgByAANQIcIhx+fCECIAMgAkIgiHwhAyACQv////8PgyAKIBl+fCECIAMgAkIgiHwhAyACQv////8PgyANIBZ+fCECIAMgAkIgiHwhAyACQv////8PgyAQIBN+fCECIAMgAkIgiHwhAyACQv////8Pg0IBhiECIANCAYYgAkIgiHwhAyACQv////8PgyAEQv////8Pg3whAiADIAJCIIh8IAV8IQMgAkL/////D4MgDCAafnwhAiADIAJCIIh8IQMgAkL/////D4MgDyAXfnwhAiADIAJCIIh8IQMgAkL/////D4MgEiAUfnwhAiADIAJCIIh8IQMgAkL/////D4MgFSARfnwhAiADIAJCIIh8IQMgAkL/////D4MgGCAOfnwhAiADIAJCIIh8IQMgAkL/////D4MgGyALfnwhAiADIAJCIIh8IQMgAkL/////D4NBADUC1BwiHiAIfnwhAiADIAJCIIh8IQMgAkL/////D4MgBn5C/////w+DIR0gAkL/////D4MgCSAdfnwhAiADIAJCIIh8IQMgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIAogHH58IQIgAyACQiCIfCEDIAJC/////w+DIA0gGX58IQIgAyACQiCIfCEDIAJC/////w+DIBAgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBMgE358IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAMIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAPIBp+fCECIAMgAkIgiHwhAyACQv////8PgyASIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAbIA5+fCECIAMgAkIgiHwhAyACQv////8PgyAeIAt+fCECIAMgAkIgiHwhAyABIAI+AgAgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIA0gHH58IQIgAyACQiCIfCEDIAJC/////w+DIBAgGX58IQIgAyACQiCIfCEDIAJC/////w+DIBMgFn58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAPIB1+fCECIAMgAkIgiHwhAyACQv////8PgyASIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBF+fCECIAMgAkIgiHwhAyACQv////8PgyAeIA5+fCECIAMgAkIgiHwhAyABIAI+AgQgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBAgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBMgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBYgFn58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyASIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAVIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBR+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBF+fCECIAMgAkIgiHwhAyABIAI+AgggAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBMgHH58IQIgAyACQiCIfCEDIAJC/////w+DIBYgGX58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAVIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAYIBp+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBd+fCECIAMgAkIgiHwhAyACQv////8PgyAeIBR+fCECIAMgAkIgiHwhAyABIAI+AgwgAyEEIARCIIghBUIAIQJCACEDIAJC/////w+DIBYgHH58IQIgAyACQiCIfCEDIAJC/////w+DQgGGIQIgA0IBhiACQiCIfCEDIAJC/////w+DIBkgGX58IQIgAyACQiCIfCEDIAJC/////w+DIARC/////w+DfCECIAMgAkIgiHwgBXwhAyACQv////8PgyAYIB1+fCECIAMgAkIgiHwhAyACQv////8PgyAbIBp+fCECIAMgAkIgiHwhAyACQv////8P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2IEBIAEQlgELC2kAQeiFARCUAUHohQFB6IUBEJsBIABBmIMBQTBByIMBEKUBQciDAUGohAEQmAEgAEGohAFBqIQBEJYBQaiEAUGIhQEQnAFBiIUBQaiEAUGIhQEQlgFBiIUBQeiFARCfAQRAQQAPC0EBDwsRACAAEJEBIABB4ABqEJEBcQsLACAAQcABahCRAQsQACAAEJMBIABB4ABqEJMBCxkAIAAQkwEgAEHgAGoQlAEgAEHAAWoQkwELggIAIAEgACkDADcDACABIAApAwg3AwggASAAKQMQNwMQIAEgACkDGDcDGCABIAApAyA3AyAgASAAKQMoNwMoIAEgACkDMDcDMCABIAApAzg3AzggASAAKQNANwNAIAEgACkDSDcDSCABIAApA1A3A1AgASAAKQNYNwNYIAEgACkDYDcDYCABIAApA2g3A2ggASAAKQNwNwNwIAEgACkDeDcDeCABIAApA4ABNwOAASABIAApA4gBNwOIASABIAApA5ABNwOQASABIAApA5gBNwOYASABIAApA6ABNwOgASABIAApA6gBNwOoASABIAApA7ABNwOwASABIAApA7gBNwO4AQuSAwAgASAAKQMANwMAIAEgACkDCDcDCCABIAApAxA3AxAgASAAKQMYNwMYIAEgACkDIDcDICABIAApAyg3AyggASAAKQMwNwMwIAEgACkDODcDOCABIAApA0A3A0AgASAAKQNINwNIIAEgACkDUDcDUCABIAApA1g3A1ggASAAKQNgNwNgIAEgACkDaDcDaCABIAApA3A3A3AgASAAKQN4NwN4IAEgACkDgAE3A4ABIAEgACkDiAE3A4gBIAEgACkDkAE3A5ABIAEgACkDmAE3A5gBIAEgACkDoAE3A6ABIAEgACkDqAE3A6gBIAEgACkDsAE3A7ABIAEgACkDuAE3A7gBIAEgACkDwAE3A8ABIAEgACkDyAE3A8gBIAEgACkD0AE3A9ABIAEgACkD2AE3A9gBIAEgACkD4AE3A+ABIAEgACkD6AE3A+gBIAEgACkD8AE3A/ABIAEgACkD+AE3A/gBIAEgACkDgAI3A4ACIAEgACkDiAI3A4gCIAEgACkDkAI3A5ACIAEgACkDmAI3A5gCCy8AIAAQqAEEQCABEKsBBSABQcABahCUASAAQeAAaiABQeAAahCVASAAIAEQlQELCxwBAX8gACABEJ8BIABB4ABqIAFB4ABqEJ8BcQ8LiwEBAX8gAEHAAWohAiAAEKkBBEAgARCoAQ8LIAEQqAEEQEEADwsgAhCSAQRAIAAgARCvAQ8LIAJBqIcBEJgBIAFBqIcBQYiIARCWASACQaiHAUHoiAEQlgEgAUHgAGpB6IgBQciJARCWASAAQYiIARCfAQRAIABB4ABqQciJARCfAQRAQQEPCwtBAA8L2QECAX8BfyAAQcABaiECIAFBwAFqIQMgABCpAQRAIAEQqQEPCyABEKkBBEBBAA8LIAIQkgEEQCABIAAQsAEPCyADEJIBBEAgACABELABDwsgAkGoigEQmAEgA0GIiwEQmAEgAEGIiwFB6IsBEJYBIAFBqIoBQciMARCWASACQaiKAUGojQEQlgEgA0GIiwFBiI4BEJYBIABB4ABqQYiOAUHojgEQlgEgAUHgAGpBqI0BQciPARCWAUHoiwFByIwBEJ8BBEBB6I4BQciPARCfAQRAQQEPCwtBAA8LrAIAIAAQqAEEQCAAIAEQrgEPCyAAQaiQARCYASAAQeAAakGIkQEQmAFBiJEBQeiRARCYASAAQYiRAUHIkgEQmQFByJIBQciSARCYAUHIkgFBqJABQciSARCaAUHIkgFB6JEBQciSARCaAUHIkgFByJIBQciSARCZAUGokAFBqJABQaiTARCZAUGokwFBqJABQaiTARCZASAAQeAAaiAAQeAAaiABQcABahCZAUGokwEgARCYASABQciSASABEJoBIAFByJIBIAEQmgFB6JEBQeiRAUGIlAEQmQFBiJQBQYiUAUGIlAEQmQFBiJQBQYiUAUGIlAEQmQFByJIBIAEgAUHgAGoQmgEgAUHgAGpBqJMBIAFB4ABqEJYBIAFB4ABqQYiUASABQeAAahCaAQvUAgAgABCpAQRAIAAgARCtAQ8LIABBwAFqEJIBBEAgACABELIBDw8LIABB6JQBEJgBIABB4ABqQciVARCYAUHIlQFBqJYBEJgBIABByJUBQYiXARCZAUGIlwFBiJcBEJgBQYiXAUHolAFBiJcBEJoBQYiXAUGolgFBiJcBEJoBQYiXAUGIlwFBiJcBEJkBQeiUAUHolAFB6JcBEJkBQeiXAUHolAFB6JcBEJkBQeiXAUHImAEQmAEgAEHgAGogAEHAAWpBqJkBEJYBQYiXAUGIlwEgARCZAUHImAEgASABEJoBQaiWAUGolgFBiJoBEJkBQYiaAUGImgFBiJoBEJkBQYiaAUGImgFBiJoBEJkBQYiXASABIAFB4ABqEJoBIAFB4ABqQeiXASABQeAAahCWASABQeAAakGImgEgAUHgAGoQmgFBqJkBQaiZASABQcABahCZAQvsAgEBfyAAQcABaiEDIAAQqAEEQCABIAIQrAEgAkHAAWoQlAEPCyABEKgBBEAgACACEKwBIAJBwAFqEJQBDwsgACABEJ8BBEAgAEHgAGogAUHgAGoQnwEEQCABIAIQsgEPCwsgASAAQeiaARCaASABQeAAaiAAQeAAakGonAEQmgFB6JoBQcibARCYAUHImwFByJsBQYidARCZAUGInQFBiJ0BQYidARCZAUHomgFBiJ0BQeidARCWAUGonAFBqJwBQcieARCZASAAQYidAUGIoAEQlgFByJ4BQaifARCYAUGIoAFBiKABQeigARCZAUGonwFB6J0BIAIQmgEgAkHooAEgAhCaASAAQeAAakHonQFByKEBEJYBQcihAUHIoQFByKEBEJkBQYigASACIAJB4ABqEJoBIAJB4ABqQcieASACQeAAahCWASACQeAAakHIoQEgAkHgAGoQmgFB6JoBQeiaASACQcABahCZAQvcAwEBfyAAQcABaiEDIAAQqQEEQCABIAIQrAEgAkHAAWoQlAEPCyABEKgBBEAgACACEK0BDwsgAxCSAQRAIAAgASACELQBDwsgA0GoogEQmAEgAUGoogFBiKMBEJYBIANBqKIBQeijARCWASABQeAAakHoowFByKQBEJYBIABBiKMBEJ8BBEAgAEHgAGpByKQBEJ8BBEAgASACELIBDwsLQYijASAAQailARCaAUHIpAEgAEHgAGpB6KYBEJoBQailAUGIpgEQmAFBiKYBQYimAUHIpwEQmQFByKcBQcinAUHIpwEQmQFBqKUBQcinAUGoqAEQlgFB6KYBQeimAUGIqQEQmQEgAEHIpwFByKoBEJYBQYipAUHoqQEQmAFByKoBQciqAUGoqwEQmQFB6KkBQaioASACEJoBIAJBqKsBIAIQmgEgAEHgAGpBqKgBQYisARCWAUGIrAFBiKwBQYisARCZAUHIqgEgAiACQeAAahCaASACQeAAakGIqQEgAkHgAGoQlgEgAkHgAGpBiKwBIAJB4ABqEJoBIANBqKUBIAJBwAFqEJkBIAJBwAFqIAJBwAFqEJgBIAJBwAFqQaiiASACQcABahCaASACQcABakGIpgEgAkHAAWoQmgELpQQCAX8BfyAAQcABaiEDIAFBwAFqIQQgABCpAQRAIAEgAhCtAQ8LIAEQqQEEQCAAIAIQrQEPCyADEJIBBEAgASAAIAIQtQEPCyAEEJIBBEAgACABIAIQtQEPCyADQeisARCYASAEQcitARCYASAAQcitAUGorgEQlgEgAUHorAFBiK8BEJYBIANB6KwBQeivARCWASAEQcitAUHIsAEQlgEgAEHgAGpByLABQaixARCWASABQeAAakHorwFBiLIBEJYBQaiuAUGIrwEQnwEEQEGosQFBiLIBEJ8BBEAgACACELMBDwsLQYivAUGorgFB6LIBEJoBQYiyAUGosQFByLMBEJoBQeiyAUHosgFBqLQBEJkBQai0AUGotAEQmAFB6LIBQai0AUGItQEQlgFByLMBQcizAUHotQEQmQFBqK4BQai0AUGotwEQlgFB6LUBQci2ARCYAUGotwFBqLcBQYi4ARCZAUHItgFBiLUBIAIQmgEgAkGIuAEgAhCaAUGosQFBiLUBQei4ARCWAUHouAFB6LgBQei4ARCZAUGotwEgAiACQeAAahCaASACQeAAakHotQEgAkHgAGoQlgEgAkHgAGpB6LgBIAJB4ABqEJoBIAMgBCACQcABahCZASACQcABaiACQcABahCYASACQcABakHorAEgAkHAAWoQmgEgAkHAAWpByK0BIAJBwAFqEJoBIAJBwAFqQeiyASACQcABahCWAQsYACAAIAEQlQEgAEHgAGogAUHgAGoQmwELJwAgACABEJUBIABB4ABqIAFB4ABqEJsBIABBwAFqIAFBwAFqEJUBCxYAIAFByLkBELcBIABByLkBIAIQtAELFgAgAUHouwEQtwEgAEHouwEgAhC1AQsWACABQYi+ARC4ASAAQYi+ASACELYBCxgAIAAgARCeASAAQeAAaiABQeAAahCeAQsnACAAIAEQngEgAEHgAGogAUHgAGoQngEgAEHAAWogAUHAAWoQngELGAAgACABEJ0BIABB4ABqIAFB4ABqEJ0BCycAIAAgARCdASAAQeAAaiABQeAAahCdASAAQcABaiABQcABahCdAQteACAAEKkB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7gJBmOwCIAEQlgFBuO4CQfjsAiABQeAAahCWAUG47gJB2O0CIAFBwAFqEJYBCzMAIAAgASACIAMQoQEgAEHgAGogASACIANB4ABqEKEBIABBwAFqIAEgAiADQcABahChAQs1ACAAQcABahCRAQRAIABB4ABqEJEBBEAgABCjAQ8FIABB4ABqEKMBDwsLIABBwAFqEKMBDwuPAgQBfwF/AX8Bf0EAKAIAIQVBACAFIAJBAWpBoAJsajYCACAFEIACIAAhBiAFQaACaiEFQQAhCAJAA0AgCCACRg0BIAYQ/QEEQCAFQaACayAFEIECBSAGIAVBoAJrIAUQggILIAYgAWohBiAFQaACaiEFIAhBAWohCAwACwsgBiABayEGIAVBoAJrIQUgAyACQQFrIARsaiEHIAUgBRCLAgJAA0AgCEUNASAGEP0BBEAgBSAFQaACaxCBAiAHEP8BBSAFQaACa0H47wIQgQIgBSAGIAVBoAJrEIICIAVB+O8CIAcQggILIAYgAWshBiAHIARrIQcgBUGgAmshBSAIQQFrIQgMAAsLQQAgBTYCAAvOAgIBfwF/IAJFBEAgAxCAAg8LIABBmPICEIECIAMQgAIgAiEEAkADQCAEQQFrIQQgASAEai0AACEFIAMgAxCDAiAFQYABTwRAIAVBgAFrIQUgA0GY8gIgAxCCAgsgAyADEIMCIAVBwABPBEAgBUHAAGshBSADQZjyAiADEIICCyADIAMQgwIgBUEgTwRAIAVBIGshBSADQZjyAiADEIICCyADIAMQgwIgBUEQTwRAIAVBEGshBSADQZjyAiADEIICCyADIAMQgwIgBUEITwRAIAVBCGshBSADQZjyAiADEIICCyADIAMQgwIgBUEETwRAIAVBBGshBSADQZjyAiADEIICCyADIAMQgwIgBUECTwRAIAVBAmshBSADQZjyAiADEIICCyADIAMQgwIgBUEBTwRAIAVBAWshBSADQZjyAiADEIICCyAERQ0BDAALCwsyACAAQbj0AhCVASAAQcABaiABEPwBIABB4ABqIAFBwAFqEJUBQbj0AiABQeAAahCVAQsRACAAEP0BIABBoAJqEP0BcQsSACAAEP4BIABBoAJqEP0BcQ8LEAAgABD/ASAAQaACahD/AQsQACAAEIACIABBoAJqEP8BCxgAIAAgARCBAiAAQaACaiAB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QeAAaiAAQcABaiADEJkBIAMgAiADEJYBIANB2M8DIAMQmgEgAyADEPwBIANB+M4DIAMQmQEgASACIANB4ABqEJkBIANB4ABqQbjQAyADQeAAahCWASADQeAAakH4zgMgA0HgAGoQmgEgA0HgAGpB2M8DIANB4ABqEJoBQZjRAyABIANBwAFqEJYBIANBwAFqQfjOAyADQcABahCaASADQcABakHYzwMgA0HAAWoQmQELkAEAIAAgASACQfjRAxCpAiAAQaACaiADQZjUAxCoAiACIANBuNYDEJkBIABBoAJqIAAgBEGgAmoQhAIgBEGgAmogAUG41gMgBEGgAmoQqQIgBEGgAmpB+NEDIARBoAJqEIUCIARBoAJqQZjUAyAEQaACahCFAkGY1AMgBBCBAiAEIAQQkAIgBEH40QMgBBCEAgtQACABIABBMGpBmNcDEBQgAUEwaiAAQTBqQcjXAxAUIAFB4ABqIABB+NcDEBQgAUGQAWogAEGo2AMQFCACIAFBwAFqQfjXA0GY1wMgAhCqAgtsACAAQdj6BCABEJYBIABB4ABqQbj7BCABQeAAahCWASAAQcABakGY/AQgAUHAAWoQlgEgAEGgAmpB+PwEIAFBoAJqEJYBIABBgANqQdj9BCABQYADahCWASAAQeADakG4/gQgAUHgA2oQlgELigIAIAAgARAAIABBMGogAUEwahASIAFBmP8EIAEQlgEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahASIAFB4ABqQfj/BCABQeAAahCWASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBIgAUHAAWpB2IAFIAFBwAFqEJYBIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQEiABQaACakG4gQUgAUGgAmoQlgEgAEGAA2ogAUGAA2oQACAAQbADaiABQbADahASIAFBgANqQZiCBSABQYADahCWASAAQeADaiABQeADahAAIABBkARqIAFBkARqEBIgAUHgA2pB+IIFIAFB4ANqEJYBC2wAIABB2IMFIAEQlgEgAEHgAGpBuIQFIAFB4ABqEJYBIABBwAFqQZiFBSABQcABahCWASAAQaACakH4hQUgAUGgAmoQlgEgAEGAA2pB2IYFIAFBgANqEJYBIABB4ANqQbiHBSABQeADahCWAQuKAgAgACABEAAgAEEwaiABQTBqEBIgAUGYiAUgARCWASAAQeAAaiABQeAAahAAIABBkAFqIAFBkAFqEBIgAUHgAGpB+IgFIAFB4ABqEJYBIABBwAFqIAFBwAFqEAAgAEHwAWogAUHwAWoQEiABQcABakHYiQUgAUHAAWoQlgEgAEGgAmogAUGgAmoQACAAQdACaiABQdACahASIAFBoAJqQbiKBSABQaACahCWASAAQYADaiABQYADahAAIABBsANqIAFBsANqEBIgAUGAA2pBmIsFIAFBgANqEJYBIABB4ANqIAFB4ANqEAAgAEGQBGogAUGQBGoQEiABQeADakH4iwUgAUHgA2oQlgELbAAgAEHYjAUgARCWASAAQeAAakG4jQUgAUHgAGoQlgEgAEHAAWpBmI4FIAFBwAFqEJYBIABBoAJqQfiOBSABQaACahCWASAAQYADakHYjwUgAUGAA2oQlgEgAEHgA2pBuJAFIAFB4ANqEJYBC4oCACAAIAEQACAAQTBqIAFBMGoQEiABQZiRBSABEJYBIABB4ABqIAFB4ABqEAAgAEGQAWogAUGQAWoQEiABQeAAakH4kQUgAUHgAGoQlgEgAEHAAWogAUHAAWoQACAAQfABaiABQfABahASIAFBwAFqQdiSBSABQcABahCWASAAQaACaiABQaACahAAIABB0AJqIAFB0AJqEBIgAUGgAmpBuJMFIAFBoAJqEJYBIABBgANqIAFBgANqEAAgAEGwA2ogAUGwA2oQEiABQYADakGYlAUgAUGAA2oQlgEgAEHgA2ogAUHgA2oQACAAQZAEaiABQZAEahASIAFB4ANqQfiUBSABQeADahCWAQtsACAAQdiVBSABEJYBIABB4ABqQbiWBSABQeAAahCWASAAQcABakGYlwUgAUHAAWoQlgEgAEGgAmpB+JcFIAFBoAJqEJYBIABBgANqQdiYBSABQYADahCWASAAQeADakG4mQUgAUHgA2oQlgELigIAIAAgARAAIABBMGogAUEwahASIAFBmJoFIAEQlgEgAEHgAGogAUHgAGoQACAAQZABaiABQZABahASIAFB4ABqQfiaBSABQeAAahCWASAAQcABaiABQcABahAAIABB8AFqIAFB8AFqEBIgAUHAAWpB2JsFIAFBwAFqEJYBIABBoAJqIAFBoAJqEAAgAEHQAmogAUHQAmoQEiAB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";
                var pq$1 = 760;
                var pr$1 = 3640;
                var pG1gen$1 = 42344;
                var pG1zero$1 = 42488;
                var pG1b$1 = 5016;
                var pG2gen$1 = 42632;
                var pG2zero$1 = 42920;
                var pG2b$1 = 17224;
                var pOneT$1 = 43208;
                var prePSize$1 = 288;
                var preQSize$1 = 20448;
                var n8q$1 = 48;
                var n8r$1 = 32;
                var q$1 = "4002409555221667393417789825735904156556882819939007885332058136124031650490837864442687629129015664037894272559787";
                var r$1 = "52435875175126190479447740508185965837690552500527637822603658699938581184513";

    var bls12381_wasm = {
    	code: code$1,
    	pq: pq$1,
    	pr: pr$1,
    	pG1gen: pG1gen$1,
    	pG1zero: pG1zero$1,
    	pG1b: pG1b$1,
    	pG2gen: pG2gen$1,
    	pG2zero: pG2zero$1,
    	pG2b: pG2b$1,
    	pOneT: pOneT$1,
    	prePSize: prePSize$1,
    	preQSize: preQSize$1,
    	n8q: n8q$1,
    	n8r: n8r$1,
    	q: q$1,
    	r: r$1
    };

    /*
        Copyright 2019 0KIMS association.

        This file is part of wasmsnark (Web Assembly zkSnark Prover).

        wasmsnark is a free software: you can redistribute it and/or modify it
        under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        wasmsnark is distributed in the hope that it will be useful, but WITHOUT
        ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
        or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
        License for more details.

        You should have received a copy of the GNU General Public License
        along with wasmsnark. If not, see <https://www.gnu.org/licenses/>.
    */

    // module.exports.buildF1 = require("./src/f1.js");
    // module.exports.buildBn128 = require("./src/bn128.js");
    // module.exports.buildMnt6753 = require("./src/mnt6753.js");

    var bn128_wasm$1 = bn128_wasm;
    var bls12381_wasm$1 = bls12381_wasm;
    // module.exports.mnt6753_wasm = require("./build/mnt6753_wasm.js");

    var wasmcurves = {
    	bn128_wasm: bn128_wasm$1,
    	bls12381_wasm: bls12381_wasm$1
    };

    /* global BigInt */

    function stringifyBigInts(o) {
        if ((typeof(o) == "bigint") || o.eq !== undefined)  {
            return o.toString(10);
        } else if (o instanceof Uint8Array) {
            return fromRprLE(o, 0);
        } else if (Array.isArray(o)) {
            return o.map(stringifyBigInts);
        } else if (typeof o == "object") {
            const res = {};
            const keys = Object.keys(o);
            keys.forEach( (k) => {
                res[k] = stringifyBigInts(o[k]);
            });
            return res;
        } else {
            return o;
        }
    }

    function unstringifyBigInts(o) {
        if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
            return BigInt(o);
        } else if (Array.isArray(o)) {
            return o.map(unstringifyBigInts);
        } else if (typeof o == "object") {
            if (o===null) return null;
            const res = {};
            const keys = Object.keys(o);
            keys.forEach( (k) => {
                res[k] = unstringifyBigInts(o[k]);
            });
            return res;
        } else {
            return o;
        }
    }

    function beBuff2int(buff) {
        let res = 0n;
        let i = buff.length;
        let offset = 0;
        const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        while (i>0) {
            if (i >= 4) {
                i -= 4;
                res += BigInt(buffV.getUint32(i)) << BigInt(offset*8);
                offset += 4;
            } else if (i >= 2) {
                i -= 2;
                res += BigInt(buffV.getUint16(i)) << BigInt(offset*8);
                offset += 2;
            } else {
                i -= 1;
                res += BigInt(buffV.getUint8(i)) << BigInt(offset*8);
                offset += 1;
            }
        }
        return res;
    }

    function beInt2Buff(n, len) {
        let r = n;
        const buff = new Uint8Array(len);
        const buffV = new DataView(buff.buffer);
        let o = len;
        while (o > 0) {
            if (o-4 >= 0) {
                o -= 4;
                buffV.setUint32(o, Number(r & 0xFFFFFFFFn));
                r = r >> 32n;
            } else if (o-2 >= 0) {
                o -= 2;
                buffV.setUint16(o, Number(r & 0xFFFFn));
                r = r >> 16n;
            } else {
                o -= 1;
                buffV.setUint8(o, Number(r & 0xFFn));
                r = r >> 8n;
            }
        }
        if (r) {
            throw new Error("Number does not fit in this length");
        }
        return buff;
    }


    function leBuff2int(buff) {
        let res = 0n;
        let i = 0;
        const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
        while (i<buff.length) {
            if (i + 4 <= buff.length) {
                res += BigInt(buffV.getUint32(i, true)) << BigInt( i*8);
                i += 4;
            } else if (i + 4 <= buff.length) {
                res += BigInt(buffV.getUint16(i, true)) << BigInt( i*8);
                i += 2;
            } else {
                res += BigInt(buffV.getUint8(i, true)) << BigInt( i*8);
                i += 1;
            }
        }
        return res;
    }

    function leInt2Buff(n, len) {
        let r = n;
        if (typeof len === "undefined") {
            len = Math.floor((bitLength$2(n) - 1) / 8) +1;
            if (len==0) len = 1;
        }
        const buff = new Uint8Array(len);
        const buffV = new DataView(buff.buffer);
        let o = 0;
        while (o < len) {
            if (o+4 <= len) {
                buffV.setUint32(o, Number(r & 0xFFFFFFFFn), true );
                o += 4;
                r = r >> 32n;
            } else if (o+2 <= len) {
                buffV.setUint16(Number(o, r & 0xFFFFn), true );
                o += 2;
                r = r >> 16n;
            } else {
                buffV.setUint8(Number(o, r & 0xFFn), true );
                o += 1;
                r = r >> 8n;
            }
        }
        if (r) {
            throw new Error("Number does not fit in this length");
        }
        return buff;
    }

    var utils_native = /*#__PURE__*/Object.freeze({
        __proto__: null,
        stringifyBigInts: stringifyBigInts,
        unstringifyBigInts: unstringifyBigInts,
        beBuff2int: beBuff2int,
        beInt2Buff: beInt2Buff,
        leBuff2int: leBuff2int,
        leInt2Buff: leInt2Buff
    });

    function stringifyBigInts$1(o) {
        if ((typeof(o) == "bigint") || o.eq !== undefined)  {
            return o.toString(10);
        } else if (Array.isArray(o)) {
            return o.map(stringifyBigInts$1);
        } else if (typeof o == "object") {
            const res = {};
            const keys = Object.keys(o);
            keys.forEach( (k) => {
                res[k] = stringifyBigInts$1(o[k]);
            });
            return res;
        } else {
            return o;
        }
    }

    function unstringifyBigInts$1(o) {
        if ((typeof(o) == "string") && (/^[0-9]+$/.test(o) ))  {
            return BigInteger(o);
        } else if (Array.isArray(o)) {
            return o.map(unstringifyBigInts$1);
        } else if (typeof o == "object") {
            const res = {};
            const keys = Object.keys(o);
            keys.forEach( (k) => {
                res[k] = unstringifyBigInts$1(o[k]);
            });
            return res;
        } else {
            return o;
        }
    }

    function beBuff2int$1(buff) {
        let res = BigInteger.zero;
        for (let i=0; i<buff.length; i++) {
            const n = BigInteger(buff[buff.length - i - 1]);
            res = res.add(n.shiftLeft(i*8));
        }
        return res;
    }

    function beInt2Buff$1(n, len) {
        let r = n;
        let o =len-1;
        const buff = new Uint8Array(len);
        while ((r.gt(BigInteger.zero))&&(o>=0)) {
            let c = Number(r.and(BigInteger("255")));
            buff[o] = c;
            o--;
            r = r.shiftRight(8);
        }
        if (!r.eq(BigInteger.zero)) {
            throw new Error("Number does not fit in this length");
        }
        return buff;
    }


    function leBuff2int$1 (buff) {
        let res = BigInteger.zero;
        for (let i=0; i<buff.length; i++) {
            const n = BigInteger(buff[i]);
            res = res.add(n.shiftLeft(i*8));
        }
        return res;
    }

    function leInt2Buff$1(n, len) {
        let r = n;
        let o =0;
        const buff = new Uint8Array(len);
        while ((r.gt(BigInteger.zero))&&(o<buff.length)) {
            let c = Number(r.and(BigInteger(255)));
            buff[o] = c;
            o++;
            r = r.shiftRight(8);
        }
        if (!r.eq(BigInteger.zero)) {
            throw new Error("Number does not fit in this length");
        }
        return buff;
    }

    var utils_bigint = /*#__PURE__*/Object.freeze({
        __proto__: null,
        stringifyBigInts: stringifyBigInts$1,
        unstringifyBigInts: unstringifyBigInts$1,
        beBuff2int: beBuff2int$1,
        beInt2Buff: beInt2Buff$1,
        leBuff2int: leBuff2int$1,
        leInt2Buff: leInt2Buff$1
    });

    let utils = {};

    const supportsNativeBigInt$2 = typeof BigInt === "function";
    if (supportsNativeBigInt$2) {
        Object.assign(utils, utils_native);
    } else {
        Object.assign(utils, utils_bigint);
    }


    const _revTable$1 = [];
    for (let i=0; i<256; i++) {
        _revTable$1[i] = _revSlow$1(i, 8);
    }

    function _revSlow$1(idx, bits) {
        let res =0;
        let a = idx;
        for (let i=0; i<bits; i++) {
            res <<= 1;
            res = res | (a &1);
            a >>=1;
        }
        return res;
    }

    utils.bitReverse = function bitReverse(idx, bits) {
        return (
            _revTable$1[idx >>> 24] |
            (_revTable$1[(idx >>> 16) & 0xFF] << 8) |
            (_revTable$1[(idx >>> 8) & 0xFF] << 16) |
            (_revTable$1[idx & 0xFF] << 24)
        ) >>> (32-bits);
    };


    utils.log2 = function log2( V )
    {
        return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
    };

    utils.buffReverseBits = function buffReverseBits(buff, eSize) {
        const n = buff.byteLength /eSize;
        const bits = utils.log2(n);
        if (n != (1 << bits)) {
            throw new Error("Invalid number of pointers");
        }
        for (let i=0; i<n; i++) {
            const r = utils.bitReverse(i,bits);
            if (i>r) {
                const tmp = buff.slice(i*eSize, (i+1)*eSize);
                buff.set( buff.slice(r*eSize, (r+1)*eSize), i*eSize);
                buff.set(tmp, r*eSize);
            }
        }
    };

    let {
        bitReverse,
        log2,
        buffReverseBits,
        stringifyBigInts: stringifyBigInts$2,
        unstringifyBigInts: unstringifyBigInts$2,
        beBuff2int: beBuff2int$2,
        beInt2Buff: beInt2Buff$2,
        leBuff2int: leBuff2int$2,
        leInt2Buff: leInt2Buff$2,
    } = utils;

    var _utils = /*#__PURE__*/Object.freeze({
        __proto__: null,
        bitReverse: bitReverse,
        log2: log2,
        buffReverseBits: buffReverseBits,
        stringifyBigInts: stringifyBigInts$2,
        unstringifyBigInts: unstringifyBigInts$2,
        beBuff2int: beBuff2int$2,
        beInt2Buff: beInt2Buff$2,
        leBuff2int: leBuff2int$2,
        leInt2Buff: leInt2Buff$2
    });

    const PAGE_SIZE = 1<<30;

    class BigBuffer {

        constructor(size) {
            this.buffers = [];
            this.byteLength = size;
            for (let i=0; i<size; i+= PAGE_SIZE) {
                const n = Math.min(size-i, PAGE_SIZE);
                this.buffers.push(new Uint8Array(n));
            }

        }

        slice(fr, to) {
            if ( to === undefined ) to = this.byteLength;
            if ( fr === undefined ) fr = 0;
            const len = to-fr;

            const firstPage = Math.floor(fr / PAGE_SIZE);
            const lastPage = Math.floor((fr+len-1) / PAGE_SIZE);

            if ((firstPage == lastPage)||(len==0))
                return this.buffers[firstPage].slice(fr%PAGE_SIZE, fr%PAGE_SIZE + len);

            let buff;

            let p = firstPage;
            let o = fr % PAGE_SIZE;
            // Remaining bytes to read
            let r = len;
            while (r>0) {
                // bytes to copy from this page
                const l = (o+r > PAGE_SIZE) ? (PAGE_SIZE -o) : r;
                const srcView = new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset+o, l);
                if (l == len) return srcView.slice();
                if (!buff) {
                    if (len <= PAGE_SIZE) {
                        buff = new Uint8Array(len);
                    } else {
                        buff = new BigBuffer(len);
                    }
                }
                buff.set(srcView, len-r);
                r = r-l;
                p ++;
                o = 0;
            }

            return buff;
        }

        set(buff, offset) {
            if (offset === undefined) offset = 0;

            const len = buff.byteLength;

            if (len==0) return;

            const firstPage = Math.floor(offset / PAGE_SIZE);
            const lastPage = Math.floor((offset+len-1) / PAGE_SIZE);

            if (firstPage == lastPage)
                return this.buffers[firstPage].set(buff, offset % PAGE_SIZE);


            let p = firstPage;
            let o = offset % PAGE_SIZE;
            let r = len;
            while (r>0) {
                const l = (o+r > PAGE_SIZE) ? (PAGE_SIZE -o) : r;
                const srcView = buff.slice( len -r, len -r+l);
                const dstView = new Uint8Array(this.buffers[p].buffer, this.buffers[p].byteOffset + o, l);
                dstView.set(srcView);
                r = r-l;
                p ++;
                o = 0;
            }

        }
    }

    function buildBatchConvert(tm, fnName, sIn, sOut) {
        return async function batchConvert(buffIn) {
            const nPoints = Math.floor(buffIn.byteLength / sIn);
            if ( nPoints * sIn !== buffIn.byteLength) {
                throw new Error("Invalid buffer size");
            }
            const pointsPerChunk = Math.floor(nPoints/tm.concurrency);
            const opPromises = [];
            for (let i=0; i<tm.concurrency; i++) {
                let n;
                if (i< tm.concurrency-1) {
                    n = pointsPerChunk;
                } else {
                    n = nPoints - i*pointsPerChunk;
                }
                if (n==0) continue;

                const buffChunk = buffIn.slice(i*pointsPerChunk*sIn, i*pointsPerChunk*sIn + n*sIn);
                const task = [
                    {cmd: "ALLOCSET", var: 0, buff:buffChunk},
                    {cmd: "ALLOC", var: 1, len:sOut * n},
                    {cmd: "CALL", fnName: fnName, params: [
                        {var: 0},
                        {val: n},
                        {var: 1}
                    ]},
                    {cmd: "GET", out: 0, var: 1, len:sOut * n},
                ];
                opPromises.push(
                    tm.queueAction(task)
                );
            }

            const result = await Promise.all(opPromises);

            let fullBuffOut;
            if (buffIn instanceof BigBuffer) {
                fullBuffOut = new BigBuffer(nPoints*sOut);
            } else {
                fullBuffOut = new Uint8Array(nPoints*sOut);
            }

            let p =0;
            for (let i=0; i<result.length; i++) {
                fullBuffOut.set(result[i][0], p);
                p+=result[i][0].byteLength;
            }

            return fullBuffOut;
        };
    }

    class WasmField1 {

        constructor(tm, prefix, n8, p) {
            this.tm = tm;
            this.prefix = prefix;

            this.p = p;
            this.n8 = n8;
            this.type = "F1";
            this.m = 1;

            this.half = shiftRight$2(p, one);
            this.bitLength = bitLength$2(p);
            this.mask = sub$2(shiftLeft$2(one, this.bitLength), one);

            this.pOp1 = tm.alloc(n8);
            this.pOp2 = tm.alloc(n8);
            this.pOp3 = tm.alloc(n8);
            this.tm.instance.exports[prefix + "_zero"](this.pOp1);
            this.zero = this.tm.getBuff(this.pOp1, this.n8);
            this.tm.instance.exports[prefix + "_one"](this.pOp1);
            this.one = this.tm.getBuff(this.pOp1, this.n8);

            this.negone = this.neg(this.one);
            this.two = this.add(this.one, this.one);

            this.n64 = Math.floor(n8/8);
            this.n32 = Math.floor(n8/4);

            if(this.n64*8 != this.n8) {
                throw new Error("n8 must be a multiple of 8");
            }

            this.half = shiftRight$2(this.p, one);
            this.nqr = this.two;
            let r = this.exp(this.nqr, this.half);
            while (!this.eq(r, this.negone)) {
                this.nqr = this.add(this.nqr, this.one);
                r = this.exp(this.nqr, this.half);
            }

            this.shift = this.mul(this.nqr, this.nqr);
            this.shiftInv = this.inv(this.shift);

            this.s = 0;
            let t = sub$2(this.p, one);

            while ( !isOdd$2(t) ) {
                this.s = this.s + 1;
                t = shiftRight$2(t, one);
            }

            this.w = [];
            this.w[this.s] = this.exp(this.nqr, t);

            for (let i= this.s-1; i>=0; i--) {
                this.w[i] = this.square(this.w[i+1]);
            }

            if (!this.eq(this.w[0], this.one)) {
                throw new Error("Error calculating roots of unity");
            }

            this.batchToMontgomery = buildBatchConvert(tm, prefix + "_batchToMontgomery", this.n8, this.n8);
            this.batchFromMontgomery = buildBatchConvert(tm, prefix + "_batchFromMontgomery", this.n8, this.n8);
        }


        op2(opName, a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        op2Bool(opName, a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
        }

        op1(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        op1Bool(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        }

        add(a,b) {
            return this.op2("_add", a, b);
        }


        eq(a,b) {
            return this.op2Bool("_eq", a, b);
        }

        isZero(a) {
            return this.op1Bool("_isZero", a);
        }

        sub(a,b) {
            return this.op2("_sub", a, b);
        }

        neg(a) {
            return this.op1("_neg", a);
        }

        inv(a) {
            return this.op1("_inverse", a);
        }

        toMontgomery(a) {
            return this.op1("_toMontgomery", a);
        }

        fromMontgomery(a) {
            return this.op1("_fromMontgomery", a);
        }

        mul(a,b) {
            return this.op2("_mul", a, b);
        }

        div(a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
            this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        square(a) {
            return this.op1("_square", a);
        }

        isSquare(a) {
            return this.op1Bool("_isSquare", a);
        }

        sqrt(a) {
            return this.op1("_sqrt", a);
        }

        exp(a, b) {
            if (!(b instanceof Uint8Array)) {
                b = toLEBuff(e$2(b));
            }
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        isNegative(a) {
            return this.op1Bool("_isNegative", a);
        }

        e(a, b) {
            if (a instanceof Uint8Array) return a;
            let ra = e$2(a, b);
            if (isNegative$2(ra)) {
                ra = neg$2(ra);
                if (gt$2(ra, this.p)) {
                    ra = mod$2(ra, this.p);
                }
                ra = sub$2(this.p, ra);
            } else {
                if (gt$2(ra, this.p)) {
                    ra = mod$2(ra, this.p);
                }
            }
            const buff = leInt2Buff$2(ra, this.n8);
            return this.toMontgomery(buff);
        }

        toString(a, radix) {
            const an = this.fromMontgomery(a);
            const s = fromRprLE(an, 0);
            return toString(s, radix);
        }

        fromRng(rng) {
            let v;
            const buff = new Uint8Array(this.n8);
            do {
                v = zero;
                for (let i=0; i<this.n64; i++) {
                    v = add$2(v,  shiftLeft$2(rng.nextU64(), 64*i));
                }
                v = band$2(v, this.mask);
            } while (geq$2(v, this.p));
            toRprLE(buff, 0, v, this.n8);
            return buff;
        }

        random() {
            return this.fromRng(getThreadRng());
        }

        toObject(a) {
            const an = this.fromMontgomery(a);
            return fromRprLE(an, 0);
        }

        fromObject(a) {
            const buff = new Uint8Array(this.n8);
            toRprLE(buff, 0, a, this.n8);
            return this.toMontgomery(buff);
        }

        toRprLE(buff, offset, a) {
            buff.set(this.fromMontgomery(a), offset);
        }

        fromRprLE(buff, offset) {
            offset = offset || 0;
            const res = buff.slice(offset, offset + this.n8);
            return this.toMontgomery(res);
        }


    }

    class WasmField2 {

        constructor(tm, prefix, F) {
            this.tm = tm;
            this.prefix = prefix;

            this.F = F;
            this.type = "F2";
            this.m = F.m * 2;
            this.n8 = this.F.n8*2;
            this.n32 = this.F.n32*2;
            this.n64 = this.F.n64*2;

            this.pOp1 = tm.alloc(F.n8*2);
            this.pOp2 = tm.alloc(F.n8*2);
            this.pOp3 = tm.alloc(F.n8*2);
            this.tm.instance.exports[prefix + "_zero"](this.pOp1);
            this.zero = tm.getBuff(this.pOp1, this.n8);
            this.tm.instance.exports[prefix + "_one"](this.pOp1);
            this.one = tm.getBuff(this.pOp1, this.n8);

            this.negone = this.neg(this.one);
            this.two = this.add(this.one, this.one);

        }

        op2(opName, a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        op2Bool(opName, a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
        }

        op1(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        op1Bool(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        }

        add(a,b) {
            return this.op2("_add", a, b);
        }

        eq(a,b) {
            return this.op2Bool("_eq", a, b);
        }

        isZero(a) {
            return this.op1Bool("_isZero", a);
        }

        sub(a,b) {
            return this.op2("_sub", a, b);
        }

        neg(a) {
            return this.op1("_neg", a);
        }

        inv(a) {
            return this.op1("_inverse", a);
        }

        isNegative(a) {
            return this.op1Bool("_isNegative", a);
        }

        toMontgomery(a) {
            return this.op1("_toMontgomery", a);
        }

        fromMontgomery(a) {
            return this.op1("_fromMontgomery", a);
        }

        mul(a,b) {
            return this.op2("_mul", a, b);
        }

        mul1(a,b) {
            return this.op2("_mul1", a, b);
        }

        div(a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
            this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        square(a) {
            return this.op1("_square", a);
        }

        isSquare(a) {
            return this.op1Bool("_isSquare", a);
        }

        sqrt(a) {
            return this.op1("_sqrt", a);
        }

        exp(a, b) {
            if (!(b instanceof Uint8Array)) {
                b = toLEBuff(e$2(b));
            }
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        e(a, b) {
            if (a instanceof Uint8Array) return a;
            if ((Array.isArray(a)) && (a.length == 2)) {
                const c1 = this.F.e(a[0], b);
                const c2 = this.F.e(a[1], b);
                const res = new Uint8Array(this.F.n8*2);
                res.set(c1);
                res.set(c2, this.F.n8*2);
                return res;
            } else {
                throw new Error("invalid F2");
            }
        }

        toString(a, radix) {
            const s1 = this.F.toString(a.slice(0, this.F.n8), radix);
            const s2 = this.F.toString(a.slice(this.F.n8), radix);
            return `[${s1}, ${s2}]`;
        }

        fromRng(rng) {
            const c1 = this.F.fromRng(rng);
            const c2 = this.F.fromRng(rng);
            const res = new Uint8Array(this.F.n8*2);
            res.set(c1);
            res.set(c2, this.F.n8);
            return res;
        }

        random() {
            return this.fromRng(getThreadRng());
        }

        toObject(a) {
            const c1 = this.F.toObject(a.slice(0, this.F.n8));
            const c2 = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
            return [c1, c2];
        }

        fromObject(a) {
            const buff = new Uint8Array(this.F.n8*2);
            const b1 = this.F.fromObject(a[0]);
            const b2 = this.F.fromObject(a[1]);
            buff.set(b1);
            buff.set(b2, this.F.n8);
            return buff;
        }

        c1(a) {
            return a.slice(0, this.F.n8);
        }

        c2(a) {
            return a.slice(this.F.n8);
        }

    }

    class WasmField3 {

        constructor(tm, prefix, F) {
            this.tm = tm;
            this.prefix = prefix;

            this.F = F;
            this.type = "F3";
            this.m = F.m * 3;
            this.n8 = this.F.n8*3;
            this.n32 = this.F.n32*3;
            this.n64 = this.F.n64*3;

            this.pOp1 = tm.alloc(F.n8*3);
            this.pOp2 = tm.alloc(F.n8*3);
            this.pOp3 = tm.alloc(F.n8*3);
            this.tm.instance.exports[prefix + "_zero"](this.pOp1);
            this.zero = tm.getBuff(this.pOp1, this.n8);
            this.tm.instance.exports[prefix + "_one"](this.pOp1);
            this.one = tm.getBuff(this.pOp1, this.n8);

            this.negone = this.neg(this.one);
            this.two = this.add(this.one, this.one);

        }

        op2(opName, a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        op2Bool(opName, a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2);
        }

        op1(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        op1Bool(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        }


        eq(a,b) {
            return this.op2Bool("_eq", a, b);
        }

        isZero(a) {
            return this.op1Bool("_isZero", a);
        }

        add(a,b) {
            return this.op2("_add", a, b);
        }

        sub(a,b) {
            return this.op2("_sub", a, b);
        }

        neg(a) {
            return this.op1("_neg", a);
        }

        inv(a) {
            return this.op1("_inverse", a);
        }

        isNegative(a) {
            return this.op1Bool("_isNegative", a);
        }

        toMontgomery(a) {
            return this.op1("_toMontgomery", a);
        }

        fromMontgomery(a) {
            return this.op1("_fromMontgomery", a);
        }

        mul(a,b) {
            return this.op2("_mul", a, b);
        }

        div(a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + "_inverse"](this.pOp2, this.pOp2);
            this.tm.instance.exports[this.prefix + "_mul"](this.pOp1, this.pOp2, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.n8);
        }

        square(a) {
            return this.op1("_square", a);
        }

        isSquare(a) {
            return this.op1Bool("_isSquare", a);
        }

        sqrt(a) {
            return this.op1("_sqrt", a);
        }

        exp(a, b) {
            if (!(b instanceof Uint8Array)) {
                b = toLEBuff(e$2(b));
            }
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + "_exp"](this.pOp1, this.pOp2, b.byteLength, this.pOp3);
            return this.getBuff(this.pOp3, this.n8);
        }

        e(a, b) {
            if (a instanceof Uint8Array) return a;
            if ((Array.isArray(a)) && (a.length == 3)) {
                const c1 = this.F.e(a[0], b);
                const c2 = this.F.e(a[1], b);
                const c3 = this.F.e(a[2], b);
                const res = new Uint8Array(this.F.n8*3);
                res.set(c1);
                res.set(c2, this.F.n8);
                res.set(c3, this.F.n8*2);
                return res;
            } else {
                throw new Error("invalid F3");
            }
        }

        toString(a, radix) {
            const s1 = this.F.toString(a.slice(0, this.F.n8), radix);
            const s2 = this.F.toString(a.slice(this.F.n8, this.F.n8*2), radix);
            const s3 = this.F.toString(a.slice(this.F.n8*2), radix);
            return `[${s1}, ${s2}, ${s3}]`;
        }

        fromRng(rng) {
            const c1 = this.F.fromRng(rng);
            const c2 = this.F.fromRng(rng);
            const c3 = this.F.fromRng(rng);
            const res = new Uint8Array(this.F.n8*3);
            res.set(c1);
            res.set(c2, this.F.n8);
            res.set(c3, this.F.n8*2);
            return res;
        }

        random() {
            return this.fromRng(getThreadRng());
        }

        toObject(a) {
            const c1 = this.F.toObject(a.slice(0, this.F.n8));
            const c2 = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
            const c3 = this.F.toObject(a.slice(this.F.n8*2, this.F.n8*3));
            return [c1, c2, c3];
        }

        fromObject(a) {
            const buff = new Uint8Array(this.F.n8*3);
            const b1 = this.F.fromObject(a[0]);
            const b2 = this.F.fromObject(a[1]);
            const b3 = this.F.fromObject(a[2]);
            buff.set(b1);
            buff.set(b2, this.F.n8);
            buff.set(b3, this.F.n8*2);
            return buff;
        }

        c1(a) {
            return a.slice(0, this.F.n8);
        }

        c2(a) {
            return a.slice(this.F.n8, this.F.n8*2);
        }

        c3(a) {
            return a.slice(this.F.n8*2);
        }

    }

    class WasmCurve {

        constructor(tm, prefix, F, pGen, pGb, cofactor) {
            this.tm = tm;
            this.prefix = prefix;
            this.F = F;

            this.pOp1 = tm.alloc(F.n8*3);
            this.pOp2 = tm.alloc(F.n8*3);
            this.pOp3 = tm.alloc(F.n8*3);
            this.tm.instance.exports[prefix + "_zero"](this.pOp1);
            this.zero = this.tm.getBuff(this.pOp1, F.n8*3);
            this.tm.instance.exports[prefix + "_zeroAffine"](this.pOp1);
            this.zeroAffine = this.tm.getBuff(this.pOp1, F.n8*2);
            this.one = this.tm.getBuff(pGen, F.n8*3);
            this.g = this.one;
            this.oneAffine = this.tm.getBuff(pGen, F.n8*2);
            this.gAffine = this.oneAffine;
            this.b = this.tm.getBuff(pGb, F.n8);

            if (cofactor) {
                this.cofactor = toLEBuff(cofactor);
            }

            this.negone = this.neg(this.one);
            this.two = this.add(this.one, this.one);

            this.batchLEMtoC = buildBatchConvert(tm, prefix + "_batchLEMtoC", F.n8*2, F.n8);
            this.batchLEMtoU = buildBatchConvert(tm, prefix + "_batchLEMtoU", F.n8*2, F.n8*2);
            this.batchCtoLEM = buildBatchConvert(tm, prefix + "_batchCtoLEM", F.n8, F.n8*2);
            this.batchUtoLEM = buildBatchConvert(tm, prefix + "_batchUtoLEM", F.n8*2, F.n8*2);
            this.batchToJacobian = buildBatchConvert(tm, prefix + "_batchToJacobian", F.n8*2, F.n8*3);
            this.batchToAffine = buildBatchConvert(tm, prefix + "_batchToAffine", F.n8*3, F.n8*2);
        }

        op2(opName, a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.F.n8*3);
        }

        op2bool(opName, a, b) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, b);
            return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp2, this.pOp3);
        }

        op1(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.F.n8*3);
        }

        op1Affine(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.F.n8*2);
        }

        op1Bool(opName, a) {
            this.tm.setBuff(this.pOp1, a);
            return !!this.tm.instance.exports[this.prefix + opName](this.pOp1, this.pOp3);
        }

        add(a,b) {
            if (a.byteLength == this.F.n8*3) {
                if (b.byteLength == this.F.n8*3) {
                    return this.op2("_add", a, b);
                } else if (b.byteLength == this.F.n8*2) {
                    return this.op2("_addMixed", a, b);
                } else {
                    throw new Error("invalid point size");
                }
            } else if (a.byteLength == this.F.n8*2) {
                if (b.byteLength == this.F.n8*3) {
                    return this.op2("_addMixed", b, a);
                } else if (b.byteLength == this.F.n8*2) {
                    return this.op2("_addAffine", a, b);
                } else {
                    throw new Error("invalid point size");
                }
            } else {
                throw new Error("invalid point size");
            }
        }

        sub(a,b) {
            if (a.byteLength == this.F.n8*3) {
                if (b.byteLength == this.F.n8*3) {
                    return this.op2("_sub", a, b);
                } else if (b.byteLength == this.F.n8*2) {
                    return this.op2("_subMixed", a, b);
                } else {
                    throw new Error("invalid point size");
                }
            } else if (a.byteLength == this.F.n8*2) {
                if (b.byteLength == this.F.n8*3) {
                    return this.op2("_subMixed", b, a);
                } else if (b.byteLength == this.F.n8*2) {
                    return this.op2("_subAffine", a, b);
                } else {
                    throw new Error("invalid point size");
                }
            } else {
                throw new Error("invalid point size");
            }
        }

        neg(a) {
            if (a.byteLength == this.F.n8*3) {
                return this.op1("_neg", a);
            } else if (a.byteLength == this.F.n8*2) {
                return this.op1Affine("_negAffine", a);
            } else {
                throw new Error("invalid point size");
            }
        }

        double(a) {
            if (a.byteLength == this.F.n8*3) {
                return this.op1("_double", a);
            } else if (a.byteLength == this.F.n8*2) {
                return this.op1("_doubleAffine", a);
            } else {
                throw new Error("invalid point size");
            }
        }

        isZero(a) {
            if (a.byteLength == this.F.n8*3) {
                return this.op1Bool("_isZero", a);
            } else if (a.byteLength == this.F.n8*2) {
                return this.op1Bool("_isZeroAffine", a);
            } else {
                throw new Error("invalid point size");
            }
        }

        timesScalar(a, s) {
            if (!(s instanceof Uint8Array)) {
                s = toLEBuff(e$2(s));
            }
            let fnName;
            if (a.byteLength == this.F.n8*3) {
                fnName = this.prefix + "_timesScalar";
            } else if (a.byteLength == this.F.n8*2) {
                fnName = this.prefix + "_timesScalarAffine";
            } else {
                throw new Error("invalid point size");
            }
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, s);
            this.tm.instance.exports[fnName](this.pOp1, this.pOp2, s.byteLength, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.F.n8*3);
        }

        timesFr(a, s) {
            let fnName;
            if (a.byteLength == this.F.n8*3) {
                fnName = this.prefix + "_timesFr";
            } else if (a.byteLength == this.F.n8*2) {
                fnName = this.prefix + "_timesFrAffine";
            } else {
                throw new Error("invalid point size");
            }
            this.tm.setBuff(this.pOp1, a);
            this.tm.setBuff(this.pOp2, s);
            this.tm.instance.exports[fnName](this.pOp1, this.pOp2, this.pOp3);
            return this.tm.getBuff(this.pOp3, this.F.n8*3);
        }

        eq(a,b) {
            if (a.byteLength == this.F.n8*3) {
                if (b.byteLength == this.F.n8*3) {
                    return this.op2bool("_eq", a, b);
                } else if (b.byteLength == this.F.n8*2) {
                    return this.op2bool("_eqMixed", a, b);
                } else {
                    throw new Error("invalid point size");
                }
            } else if (a.byteLength == this.F.n8*2) {
                if (b.byteLength == this.F.n8*3) {
                    return this.op2bool("_eqMixed", b, a);
                } else if (b.byteLength == this.F.n8*2) {
                    return this.op2bool("_eqAffine", a, b);
                } else {
                    throw new Error("invalid point size");
                }
            } else {
                throw new Error("invalid point size");
            }
        }

        toAffine(a) {
            if (a.byteLength == this.F.n8*3) {
                return this.op1Affine("_toAffine", a);
            } else if (a.byteLength == this.F.n8*2) {
                return a;
            } else {
                throw new Error("invalid point size");
            }
        }

        toJacobian(a) {
            if (a.byteLength == this.F.n8*3) {
                return a;
            } else if (a.byteLength == this.F.n8*2) {
                return this.op1("_toJacobian", a);
            } else {
                throw new Error("invalid point size");
            }
        }

        toRprUncompressed(arr, offset, a) {
            this.tm.setBuff(this.pOp1, a);
            if (a.byteLength == this.F.n8*3) {
                this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
            } else if (a.byteLength != this.F.n8*2) {
                throw new Error("invalid point size");
            }
            this.tm.instance.exports[this.prefix + "_LEMtoU"](this.pOp1, this.pOp1);
            const res = this.tm.getBuff(this.pOp1, this.F.n8*2);
            arr.set(res, offset);
        }

        fromRprUncompressed(arr, offset) {
            const buff = arr.slice(offset, offset + this.F.n8*2);
            this.tm.setBuff(this.pOp1, buff);
            this.tm.instance.exports[this.prefix + "_UtoLEM"](this.pOp1, this.pOp1);
            return this.tm.getBuff(this.pOp1, this.F.n8*2);
        }

        toRprCompressed(arr, offset, a) {
            this.tm.setBuff(this.pOp1, a);
            if (a.byteLength == this.F.n8*3) {
                this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
            } else if (a.byteLength != this.F.n8*2) {
                throw new Error("invalid point size");
            }
            this.tm.instance.exports[this.prefix + "_LEMtoC"](this.pOp1, this.pOp1);
            const res = this.tm.getBuff(this.pOp1, this.F.n8);
            arr.set(res, offset);
        }

        fromRprCompressed(arr, offset) {
            const buff = arr.slice(offset, offset + this.F.n8);
            this.tm.setBuff(this.pOp1, buff);
            this.tm.instance.exports[this.prefix + "_CtoLEM"](this.pOp1, this.pOp2);
            return this.tm.getBuff(this.pOp2, this.F.n8*2);
        }

        toUncompressed(a) {
            const buff = new Uint8Array(this.F.n8*2);
            this.toRprUncompressed(buff, 0, a);
            return buff;
        }

        toRprLEM(arr, offset, a) {
            if (a.byteLength == this.F.n8*2) {
                arr.set(a, offset);
                return;
            } else if (a.byteLength == this.F.n8*3) {
                this.tm.setBuff(this.pOp1, a);
                this.tm.instance.exports[this.prefix + "_toAffine"](this.pOp1, this.pOp1);
                const res = this.tm.getBuff(this.pOp1, this.F.n8*2);
                arr.set(res, offset);
            } else {
                throw new Error("invalid point size");
            }
        }

        fromRprLEM(arr, offset) {
            offset = offset || 0;
            return arr.slice(offset, offset+this.F.n8*2);
        }

        toString(a, radix) {
            if (a.byteLength == this.F.n8*3) {
                const x = this.F.toString(a.slice(0, this.F.n8), radix);
                const y = this.F.toString(a.slice(this.F.n8, this.F.n8*2), radix);
                const z = this.F.toString(a.slice(this.F.n8*2), radix);
                return `[ ${x}, ${y}, ${z} ]`;
            } else if (a.byteLength == this.F.n8*2) {
                const x = this.F.toString(a.slice(0, this.F.n8), radix);
                const y = this.F.toString(a.slice(this.F.n8), radix);
                return `[ ${x}, ${y} ]`;
            } else {
                throw new Error("invalid point size");
            }
        }


        fromRng(rng) {
            const F = this.F;
            let P = [];
            let greatest;
            let x3b;
            do {
                P[0] = F.fromRng(rng);
                greatest = rng.nextBool();
                x3b = F.add(F.mul(F.square(P[0]), P[0]), this.b);
            } while (!F.isSquare(x3b));

            P[1] = F.sqrt(x3b);

            const s = F.isNegative(P[1]);
            if (greatest ^ s) P[1] = F.neg(P[1]);

            let Pbuff = new Uint8Array(this.F.n8*2);
            Pbuff.set(P[0]);
            Pbuff.set(P[1], this.F.n8);

            if (this.cofactor) {
                Pbuff = this.timesScalar(Pbuff, this.cofactor);
            }

            return Pbuff;
        }



        toObject(a) {
            if (this.isZero(a)) {
                return [
                    this.F.toObject(this.F.zero),
                    this.F.toObject(this.F.one),
                    this.F.toObject(this.F.zero),
                ];
            }
            const x = this.F.toObject(a.slice(0, this.F.n8));
            const y = this.F.toObject(a.slice(this.F.n8, this.F.n8*2));
            let z;
            if (a.byteLength == this.F.n8*3) {
                z = this.F.toObject(a.slice(this.F.n8*2, this.F.n8*3));
            } else {
                z = this.F.toObject(this.F.one);
            }
            return [x, y, z];
        }

        fromObject(a) {
            const x = this.F.fromObject(a[0]);
            const y = this.F.fromObject(a[1]);
            let z;
            if (a.length==3) {
                z = this.F.fromObject(a[2]);
            } else {
                z = this.F.one;
            }
            if (this.F.isZero(z, this.F.one)) {
                return this.zeroAffine;
            } else if (this.F.eq(z, this.F.one)) {
                const buff = new Uint8Array(this.F.n8*2);
                buff.set(x);
                buff.set(y, this.F.n8);
                return buff;
            } else {
                const buff = new Uint8Array(this.F.n8*3);
                buff.set(x);
                buff.set(y, this.F.n8);
                buff.set(z, this.F.n8*2);
                return buff;
            }
        }

        e(a) {
            if (a instanceof Uint8Array) return a;
            return this.fromObject(a);
        }

        x(a) {
            const tmp = this.toAffine(a);
            return tmp.slice(0, this.F.n8);
        }

        y(a) {
            const tmp = this.toAffine(a);
            return tmp.slice(this.F.n8);
        }

    }

    /* global WebAssembly */

    function thread(self) {
        const MAXMEM = 32767;
        let instance;
        let memory;

        if (self) {
            self.onmessage = function(e) {
                let data;
                if (e.data) {
                    data = e.data;
                } else {
                    data = e;
                }

                if (data[0].cmd == "INIT") {
                    init(data[0]).then(function() {
                        self.postMessage(data.result);
                    });
                } else if (data[0].cmd == "TERMINATE") {
                    process.exit();
                } else {
                    const res = runTask(data);
                    self.postMessage(res);
                }
            };
        }

        async function init(data) {
            const code = new Uint8Array(data.code);
            const wasmModule = await WebAssembly.compile(code);
            memory = new WebAssembly.Memory({initial:data.init, maximum: MAXMEM});

            instance = await WebAssembly.instantiate(wasmModule, {
                env: {
                    "memory": memory
                }
            });
        }



        function alloc(length) {
            const u32 = new Uint32Array(memory.buffer, 0, 1);
            while (u32[0] & 3) u32[0]++;  // Return always aligned pointers
            const res = u32[0];
            u32[0] += length;
            if (u32[0] + length > memory.buffer.byteLength) {
                const currentPages = memory.buffer.byteLength / 0x10000;
                let requiredPages = Math.floor((u32[0] + length) / 0x10000)+1;
                if (requiredPages>MAXMEM) requiredPages=MAXMEM;
                memory.grow(requiredPages-currentPages);
            }
            return res;
        }

        function allocBuffer(buffer) {
            const p = alloc(buffer.byteLength);
            setBuffer(p, buffer);
            return p;
        }

        function getBuffer(pointer, length) {
            const u8 = new Uint8Array(memory.buffer);
            return new Uint8Array(u8.buffer, u8.byteOffset + pointer, length);
        }

        function setBuffer(pointer, buffer) {
            const u8 = new Uint8Array(memory.buffer);
            u8.set(new Uint8Array(buffer), pointer);
        }

        function runTask(task) {
            if (task[0].cmd == "INIT") {
                return init(task[0]);
            }
            const ctx = {
                vars: [],
                out: []
            };
            const u32a = new Uint32Array(memory.buffer, 0, 1);
            const oldAlloc = u32a[0];
            for (let i=0; i<task.length; i++) {
                switch (task[i].cmd) {
                case "ALLOCSET":
                    ctx.vars[task[i].var] = allocBuffer(task[i].buff);
                    break;
                case "ALLOC":
                    ctx.vars[task[i].var] = alloc(task[i].len);
                    break;
                case "SET":
                    setBuffer(ctx.vars[task[i].var], task[i].buff);
                    break;
                case "CALL": {
                    const params = [];
                    for (let j=0; j<task[i].params.length; j++) {
                        const p = task[i].params[j];
                        if (typeof p.var !== "undefined") {
                            params.push(ctx.vars[p.var] + (p.offset || 0));
                        } else if (typeof p.val != "undefined") {
                            params.push(p.val);
                        }
                    }
                    instance.exports[task[i].fnName](...params);
                    break;
                }
                case "GET":
                    ctx.out[task[i].out] = getBuffer(ctx.vars[task[i].var], task[i].len).slice();
                    break;
                default:
                    throw new Error("Invalid cmd");
                }
            }
            const u32b = new Uint32Array(memory.buffer, 0, 1);
            u32b[0] = oldAlloc;
            return ctx.out;
        }


        return runTask;
    }

    var os = {};

    /* global window, navigator, Blob, Worker, WebAssembly */
    /*
        Copyright 2019 0KIMS association.

        This file is part of wasmsnark (Web Assembly zkSnark Prover).

        wasmsnark is a free software: you can redistribute it and/or modify it
        under the terms of the GNU General Public License as published by
        the Free Software Foundation, either version 3 of the License, or
        (at your option) any later version.

        wasmsnark is distributed in the hope that it will be useful, but WITHOUT
        ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
        or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public
        License for more details.

        You should have received a copy of the GNU General Public License
        along with wasmsnark. If not, see <https://www.gnu.org/licenses/>.
    */

    // const MEM_SIZE = 1000;  // Memory size in 64K Pakes (512Mb)
    const MEM_SIZE = 25;  // Memory size in 64K Pakes (1600Kb)

    class Deferred {
        constructor() {
            this.promise = new Promise((resolve, reject)=> {
                this.reject = reject;
                this.resolve = resolve;
            });
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function base64ToArrayBuffer(base64) {
        {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes;
        }
    }




    async function buildThreadManager(wasm, singleThread) {
        const tm = new ThreadManager();

        tm.memory = new WebAssembly.Memory({initial:MEM_SIZE});
        tm.u8 = new Uint8Array(tm.memory.buffer);
        tm.u32 = new Uint32Array(tm.memory.buffer);

        const wasmModule = await WebAssembly.compile(base64ToArrayBuffer(wasm.code));

        tm.instance = await WebAssembly.instantiate(wasmModule, {
            env: {
                "memory": tm.memory
            }
        });

        tm.singleThread = singleThread;
        tm.initalPFree = tm.u32[0];   // Save the Pointer to free space.
        tm.pq = wasm.pq;
        tm.pr = wasm.pr;
        tm.pG1gen = wasm.pG1gen;
        tm.pG1zero = wasm.pG1zero;
        tm.pG2gen = wasm.pG2gen;
        tm.pG2zero = wasm.pG2zero;
        tm.pOneT = wasm.pOneT;

        //    tm.pTmp0 = tm.alloc(curve.G2.F.n8*3);
        //    tm.pTmp1 = tm.alloc(curve.G2.F.n8*3);


        if (singleThread) {
            tm.code = base64ToArrayBuffer(wasm.code);
            tm.taskManager = thread();
            await tm.taskManager([{
                cmd: "INIT",
                init: MEM_SIZE,
                code: tm.code.slice()
            }]);
            tm.concurrency  = 1;
        } else {
            tm.workers = [];
            tm.pendingDeferreds = [];
            tm.working = [];

            let concurrency;

            if ((typeof(navigator) === "object") && navigator.hardwareConcurrency) {
                concurrency = navigator.hardwareConcurrency;
            } else {
                concurrency = os.cpus().length;
            }
            // Limit to 64 threads for memory reasons.
            if (concurrency>64) concurrency=64;
            tm.concurrency = concurrency;

            for (let i = 0; i<concurrency; i++) {

                const blob = new Blob(["(", thread.toString(), ")(self);"], { type: "text/javascript" });
                const url = URL.createObjectURL(blob);

                tm.workers[i] = new Worker(url);

                tm.workers[i].onmessage = getOnMsg(i);

                tm.working[i]=false;
            }

            const initPromises = [];
            for (let i=0; i<tm.workers.length;i++) {
                const copyCode = base64ToArrayBuffer(wasm.code).slice();
                initPromises.push(tm.postAction(i, [{
                    cmd: "INIT",
                    init: MEM_SIZE,
                    code: copyCode
                }], [copyCode.buffer]));
            }

            await Promise.all(initPromises);

        }
        return tm;

        function getOnMsg(i) {
            return function(e) {
                let data;
                if ((e)&&(e.data)) {
                    data = e.data;
                } else {
                    data = e;
                }

                tm.working[i]=false;
                tm.pendingDeferreds[i].resolve(data);
                tm.processWorks();
            };
        }

    }

    class ThreadManager {
        constructor() {
            this.actionQueue = [];
            this.oldPFree = 0;
        }

        startSyncOp() {
            if (this.oldPFree != 0) throw new Error("Sync operation in progress");
            this.oldPFree = this.u32[0];
        }

        endSyncOp() {
            if (this.oldPFree == 0) throw new Error("No sync operation in progress");
            this.u32[0] = this.oldPFree;
            this.oldPFree = 0;
        }

        postAction(workerId, e, transfers, _deferred) {
            if (this.working[workerId]) {
                throw new Error("Posting a job t a working worker");
            }
            this.working[workerId] = true;

            this.pendingDeferreds[workerId] = _deferred ? _deferred : new Deferred();
            this.workers[workerId].postMessage(e, transfers);

            return this.pendingDeferreds[workerId].promise;
        }

        processWorks() {
            for (let i=0; (i<this.workers.length)&&(this.actionQueue.length > 0); i++) {
                if (this.working[i] == false) {
                    const work = this.actionQueue.shift();
                    this.postAction(i, work.data, work.transfers, work.deferred);
                }
            }
        }

        queueAction(actionData, transfers) {
            const d = new Deferred();

            if (this.singleThread) {
                const res = this.taskManager(actionData);
                d.resolve(res);
            } else {
                this.actionQueue.push({
                    data: actionData,
                    transfers: transfers,
                    deferred: d
                });
                this.processWorks();
            }
            return d.promise;
        }

        resetMemory() {
            this.u32[0] = this.initalPFree;
        }

        allocBuff(buff) {
            const pointer = this.alloc(buff.byteLength);
            this.setBuff(pointer, buff);
            return pointer;
        }

        getBuff(pointer, length) {
            return this.u8.slice(pointer, pointer+ length);
        }

        setBuff(pointer, buffer) {
            this.u8.set(new Uint8Array(buffer), pointer);
        }

        alloc(length) {
            while (this.u32[0] & 3) this.u32[0]++;  // Return always aligned pointers
            const res = this.u32[0];
            this.u32[0] += length;
            return res;
        }

        async terminate() {
            for (let i=0; i<this.workers.length; i++) {
                this.workers[i].postMessage([{cmd: "TERMINATE"}]);
            }
            await sleep(200);
        }

    }

    function buildBatchApplyKey(curve, groupName) {
        const G = curve[groupName];
        const Fr = curve.Fr;
        const tm = curve.tm;

        curve[groupName].batchApplyKey = async function(buff, first, inc, inType, outType) {
            inType = inType || "affine";
            outType = outType || "affine";
            let fnName, fnAffine;
            let sGin, sGmid, sGout;
            if (groupName == "G1") {
                if (inType == "jacobian") {
                    sGin = G.F.n8*3;
                    fnName = "g1m_batchApplyKey";
                } else {
                    sGin = G.F.n8*2;
                    fnName = "g1m_batchApplyKeyMixed";
                }
                sGmid = G.F.n8*3;
                if (outType == "jacobian") {
                    sGout = G.F.n8*3;
                } else {
                    fnAffine = "g1m_batchToAffine";
                    sGout = G.F.n8*2;
                }
            } else if (groupName == "G2") {
                if (inType == "jacobian") {
                    sGin = G.F.n8*3;
                    fnName = "g2m_batchApplyKey";
                } else {
                    sGin = G.F.n8*2;
                    fnName = "g2m_batchApplyKeyMixed";
                }
                sGmid = G.F.n8*3;
                if (outType == "jacobian") {
                    sGout = G.F.n8*3;
                } else {
                    fnAffine = "g2m_batchToAffine";
                    sGout = G.F.n8*2;
                }
            } else if (groupName == "Fr") {
                fnName = "frm_batchApplyKey";
                sGin = G.n8;
                sGmid = G.n8;
                sGout = G.n8;
            } else {
                throw new Error("Invalid group: " + groupName);
            }
            const nPoints = Math.floor(buff.byteLength / sGin);
            const pointsPerChunk = Math.floor(nPoints/tm.concurrency);
            const opPromises = [];
            inc = Fr.e(inc);
            let t = Fr.e(first);
            for (let i=0; i<tm.concurrency; i++) {
                let n;
                if (i< tm.concurrency-1) {
                    n = pointsPerChunk;
                } else {
                    n = nPoints - i*pointsPerChunk;
                }
                if (n==0) continue;

                const task = [];

                task.push({
                    cmd: "ALLOCSET",
                    var: 0,
                    buff: buff.slice(i*pointsPerChunk*sGin, i*pointsPerChunk*sGin + n*sGin)
                });
                task.push({cmd: "ALLOCSET", var: 1, buff: t});
                task.push({cmd: "ALLOCSET", var: 2, buff: inc});
                task.push({cmd: "ALLOC", var: 3, len: n*Math.max(sGmid, sGout)});
                task.push({
                    cmd: "CALL",
                    fnName: fnName,
                    params: [
                        {var: 0},
                        {val: n},
                        {var: 1},
                        {var: 2},
                        {var:3}
                    ]
                });
                if (fnAffine) {
                    task.push({
                        cmd: "CALL",
                        fnName: fnAffine,
                        params: [
                            {var: 3},
                            {val: n},
                            {var: 3},
                        ]
                    });
                }
                task.push({cmd: "GET", out: 0, var: 3, len: n*sGout});

                opPromises.push(tm.queueAction(task));
                t = Fr.mul(t, Fr.exp(inc, n));
            }

            const result = await Promise.all(opPromises);

            let outBuff;
            if (buff instanceof BigBuffer) {
                outBuff = new BigBuffer(nPoints*sGout);
            } else {
                outBuff = new Uint8Array(nPoints*sGout);
            }

            let p=0;
            for (let i=0; i<result.length; i++) {
                outBuff.set(result[i][0], p);
                p += result[i][0].byteLength;
            }

            return outBuff;
        };
    }

    function buildPairing(curve) {
        const tm = curve.tm;
        curve.pairing = function pairing(a, b) {

            tm.startSyncOp();
            const pA = tm.allocBuff(curve.G1.toJacobian(a));
            const pB = tm.allocBuff(curve.G2.toJacobian(b));
            const pRes = tm.alloc(curve.Gt.n8);
            tm.instance.exports[curve.name + "_pairing"](pA, pB, pRes);

            const res = tm.getBuff(pRes, curve.Gt.n8);

            tm.endSyncOp();
            return res;
        };

        curve.pairingEq = async function pairingEq() {
            let  buffCt;
            let nEqs;
            if ((arguments.length % 2) == 1) {
                buffCt = arguments[arguments.length-1];
                nEqs = (arguments.length -1) /2;
            } else {
                buffCt = curve.Gt.one;
                nEqs = arguments.length /2;
            }

            const opPromises = [];
            for (let i=0; i<nEqs; i++) {

                const task = [];

                const g1Buff = curve.G1.toJacobian(arguments[i*2]);
                task.push({cmd: "ALLOCSET", var: 0, buff: g1Buff});
                task.push({cmd: "ALLOC", var: 1, len: curve.prePSize});

                const g2Buff = curve.G2.toJacobian(arguments[i*2 +1]);
                task.push({cmd: "ALLOCSET", var: 2, buff: g2Buff});
                task.push({cmd: "ALLOC", var: 3, len: curve.preQSize});

                task.push({cmd: "ALLOC", var: 4, len: curve.Gt.n8});

                task.push({cmd: "CALL", fnName: curve.name + "_prepareG1", params: [
                    {var: 0},
                    {var: 1}
                ]});

                task.push({cmd: "CALL", fnName: curve.name + "_prepareG2", params: [
                    {var: 2},
                    {var: 3}
                ]});

                task.push({cmd: "CALL", fnName: curve.name + "_millerLoop", params: [
                    {var: 1},
                    {var: 3},
                    {var: 4}
                ]});

                task.push({cmd: "GET", out: 0, var: 4, len: curve.Gt.n8});

                opPromises.push(
                    tm.queueAction(task)
                );
            }


            const result = await Promise.all(opPromises);

            tm.startSyncOp();
            const pRes = tm.alloc(curve.Gt.n8);
            tm.instance.exports.ftm_one(pRes);

            for (let i=0; i<result.length; i++) {
                const pMR = tm.allocBuff(result[i][0]);
                tm.instance.exports.ftm_mul(pRes, pMR, pRes);
            }
            tm.instance.exports[curve.name + "_finalExponentiation"](pRes, pRes);

            const pCt = tm.allocBuff(buffCt);

            const r = !!tm.instance.exports.ftm_eq(pRes, pCt);

            tm.endSyncOp();

            return r;
        };

        curve.prepareG1 = function(p) {
            this.tm.startSyncOp();
            const pP = this.tm.allocBuff(p);
            const pPrepP = this.tm.alloc(this.prePSize);
            this.tm.instance.exports[this.name + "_prepareG1"](pP, pPrepP);
            const res = this.tm.getBuff(pPrepP, this.prePSize);
            this.tm.endSyncOp();
            return res;
        };

        curve.prepareG2 = function(q) {
            this.tm.startSyncOp();
            const pQ = this.tm.allocBuff(q);
            const pPrepQ = this.tm.alloc(this.preQSize);
            this.tm.instance.exports[this.name + "_prepareG2"](pQ, pPrepQ);
            const res = this.tm.getBuff(pPrepQ, this.preQSize);
            this.tm.endSyncOp();
            return res;
        };

        curve.millerLoop = function(preP, preQ) {
            this.tm.startSyncOp();
            const pPreP = this.tm.allocBuff(preP);
            const pPreQ = this.tm.allocBuff(preQ);
            const pRes = this.tm.alloc(this.Gt.n8);
            this.tm.instance.exports[this.name + "_millerLoop"](pPreP, pPreQ, pRes);
            const res = this.tm.getBuff(pRes, this.Gt.n8);
            this.tm.endSyncOp();
            return res;
        };

        curve.finalExponentiation = function(a) {
            this.tm.startSyncOp();
            const pA = this.tm.allocBuff(a);
            const pRes = this.tm.alloc(this.Gt.n8);
            this.tm.instance.exports[this.name + "_finalExponentiation"](pA, pRes);
            const res = this.tm.getBuff(pRes, this.Gt.n8);
            this.tm.endSyncOp();
            return res;
        };

    }

    const pTSizes = [
        1 ,  1,  1,  1,    2,  3,  4,  5,
        6 ,  7,  7,  8,    9, 10, 11, 12,
        13, 13, 14, 15,   16, 16, 17, 17,
        17, 17, 17, 17,   17, 17, 17, 17
    ];

    function buildMultiexp(curve, groupName) {
        const G = curve[groupName];
        const tm = G.tm;
        async function _multiExpChunk(buffBases, buffScalars, inType, logger, logText) {
            if ( ! (buffBases instanceof Uint8Array) ) {
                if (logger) logger.error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
                throw new Error(`${logText} _multiExpChunk buffBases is not Uint8Array`);
            }
            if ( ! (buffScalars instanceof Uint8Array) ) {
                if (logger) logger.error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
                throw new Error(`${logText} _multiExpChunk buffScalars is not Uint8Array`);
            }
            inType = inType || "affine";

            let sGIn;
            let fnName;
            if (groupName == "G1") {
                if (inType == "affine") {
                    fnName = "g1m_multiexpAffine_chunk";
                    sGIn = G.F.n8*2;
                } else {
                    fnName = "g1m_multiexp_chunk";
                    sGIn = G.F.n8*3;
                }
            } else if (groupName == "G2") {
                if (inType == "affine") {
                    fnName = "g2m_multiexpAffine_chunk";
                    sGIn = G.F.n8*2;
                } else {
                    fnName = "g2m_multiexp_chunk";
                    sGIn = G.F.n8*3;
                }
            } else {
                throw new Error("Invalid group");
            }
            const nPoints = Math.floor(buffBases.byteLength / sGIn);

            if (nPoints == 0) return G.zero;
            const sScalar = Math.floor(buffScalars.byteLength / nPoints);
            if( sScalar * nPoints != buffScalars.byteLength) {
                throw new Error("Scalar size does not match");
            }

            const bitChunkSize = pTSizes[log2(nPoints)];
            const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

            const opPromises = [];
            for (let i=0; i<nChunks; i++) {
                const task = [
                    {cmd: "ALLOCSET", var: 0, buff: buffBases},
                    {cmd: "ALLOCSET", var: 1, buff: buffScalars},
                    {cmd: "ALLOC", var: 2, len: G.F.n8*3},
                    {cmd: "CALL", fnName: fnName, params: [
                        {var: 0},
                        {var: 1},
                        {val: sScalar},
                        {val: nPoints},
                        {val: i*bitChunkSize},
                        {val: Math.min(sScalar*8 - i*bitChunkSize, bitChunkSize)},
                        {var: 2}
                    ]},
                    {cmd: "GET", out: 0, var: 2, len: G.F.n8*3}
                ];
                opPromises.push(
                    G.tm.queueAction(task)
                );
            }

            const result = await Promise.all(opPromises);

            let res = G.zero;
            for (let i=result.length-1; i>=0; i--) {
                if (!G.isZero(res)) {
                    for (let j=0; j<bitChunkSize; j++) res = G.double(res);
                }
                res = G.add(res, result[i][0]);
            }

            return res;
        }

        async function _multiExp(buffBases, buffScalars, inType, logger, logText) {
            const MAX_CHUNK_SIZE = 1 << 22;
            const MIN_CHUNK_SIZE = 1 << 10;
            let sGIn;

            if (groupName == "G1") {
                if (inType == "affine") {
                    sGIn = G.F.n8*2;
                } else {
                    sGIn = G.F.n8*3;
                }
            } else if (groupName == "G2") {
                if (inType == "affine") {
                    sGIn = G.F.n8*2;
                } else {
                    sGIn = G.F.n8*3;
                }
            } else {
                throw new Error("Invalid group");
            }

            const nPoints = Math.floor(buffBases.byteLength / sGIn);
            const sScalar = Math.floor(buffScalars.byteLength / nPoints);
            if( sScalar * nPoints != buffScalars.byteLength) {
                throw new Error("Scalar size does not match");
            }

            const bitChunkSize = pTSizes[log2(nPoints)];
            const nChunks = Math.floor((sScalar*8 - 1) / bitChunkSize) +1;

            let chunkSize;
            chunkSize = Math.floor(nPoints / (tm.concurrency /nChunks));
            if (chunkSize>MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;
            if (chunkSize<MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;

            const opPromises = [];
            for (let i=0; i<nPoints; i += chunkSize) {
                if (logger) logger.debug(`Multiexp start: ${logText}: ${i}/${nPoints}`);
                const n= Math.min(nPoints - i, chunkSize);
                const buffBasesChunk = buffBases.slice(i*sGIn, (i+n)*sGIn);
                const buffScalarsChunk = buffScalars.slice(i*sScalar, (i+n)*sScalar);
                opPromises.push(_multiExpChunk(buffBasesChunk, buffScalarsChunk, inType, logger, logText).then( (r) => {
                    if (logger) logger.debug(`Multiexp end: ${logText}: ${i}/${nPoints}`);
                    return r;
                }));
            }

            const result = await Promise.all(opPromises);

            let res = G.zero;
            for (let i=result.length-1; i>=0; i--) {
                res = G.add(res, result[i]);
            }

            return res;
        }

        G.multiExp = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
            return await _multiExp(buffBases, buffScalars, "jacobian", logger, logText);
        };
        G.multiExpAffine = async function multiExpAffine(buffBases, buffScalars, logger, logText) {
            return await _multiExp(buffBases, buffScalars, "affine", logger, logText);
        };
    }

    function buildFFT(curve, groupName) {
        const G = curve[groupName];
        const Fr = curve.Fr;
        const tm = G.tm;
        async function _fft(buff, inverse, inType, outType, logger, loggerTxt) {

            inType = inType || "affine";
            outType = outType || "affine";
            const MAX_BITS_THREAD = 14;

            let sIn, sMid, sOut, fnIn2Mid, fnMid2Out, fnFFTMix, fnFFTJoin, fnFFTFinal;
            if (groupName == "G1") {
                if (inType == "affine") {
                    sIn = G.F.n8*2;
                    fnIn2Mid = "g1m_batchToJacobian";
                } else {
                    sIn = G.F.n8*3;
                }
                sMid = G.F.n8*3;
                if (inverse) {
                    fnFFTFinal = "g1m_fftFinal";
                }
                fnFFTJoin = "g1m_fftJoin";
                fnFFTMix = "g1m_fftMix";

                if (outType == "affine") {
                    sOut = G.F.n8*2;
                    fnMid2Out = "g1m_batchToAffine";
                } else {
                    sOut = G.F.n8*3;
                }

            } else if (groupName == "G2") {
                if (inType == "affine") {
                    sIn = G.F.n8*2;
                    fnIn2Mid = "g2m_batchToJacobian";
                } else {
                    sIn = G.F.n8*3;
                }
                sMid = G.F.n8*3;
                if (inverse) {
                    fnFFTFinal = "g2m_fftFinal";
                }
                fnFFTJoin = "g2m_fftJoin";
                fnFFTMix = "g2m_fftMix";
                if (outType == "affine") {
                    sOut = G.F.n8*2;
                    fnMid2Out = "g2m_batchToAffine";
                } else {
                    sOut = G.F.n8*3;
                }
            } else if (groupName == "Fr") {
                sIn = G.n8;
                sMid = G.n8;
                sOut = G.n8;
                if (inverse) {
                    fnFFTFinal = "frm_fftFinal";
                }
                fnFFTMix = "frm_fftMix";
                fnFFTJoin = "frm_fftJoin";
            }


            let returnArray = false;
            if (Array.isArray(buff)) {
                buff = curve.array2buffer(buff, sIn);
                returnArray = true;
            }

            const nPoints = buff.byteLength / sIn;
            const bits = log2(nPoints);

            if  ((1 << bits) != nPoints) {
                throw new Error("fft must be multiple of 2" );
            }

            if (bits == Fr.s +1) {
                let buffOut;

                if (inverse) {
                    buffOut =  await _fftExtInv(buff, inType, outType, logger, loggerTxt);
                } else {
                    buffOut =  await _fftExt(buff, inType, outType, logger, loggerTxt);
                }

                if (returnArray) {
                    return curve.buffer2array(buffOut, sOut);
                } else {
                    return buffOut;
                }
            }

            let inv;
            if (inverse) {
                inv = Fr.inv(Fr.e(nPoints));
            }

            let buffOut;

            buffReverseBits(buff, sIn);

            let chunks;
            let pointsInChunk = Math.min(1 << MAX_BITS_THREAD, nPoints);
            let nChunks = nPoints / pointsInChunk;

            while ((nChunks < tm.concurrency)&&(pointsInChunk>=16)) {
                nChunks *= 2;
                pointsInChunk /= 2;
            }

            const l2Chunk = log2(pointsInChunk);

            const promises = [];
            for (let i = 0; i< nChunks; i++) {
                if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix start: ${i}/${nChunks}`);
                const task = [];
                task.push({cmd: "ALLOC", var: 0, len: sMid*pointsInChunk});
                const buffChunk = buff.slice( (pointsInChunk * i)*sIn, (pointsInChunk * (i+1))*sIn);
                task.push({cmd: "SET", var: 0, buff: buffChunk});
                if (fnIn2Mid) {
                    task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                }
                for (let j=1; j<=l2Chunk;j++) {
                    task.push({cmd: "CALL", fnName:fnFFTMix, params: [{var:0}, {val: pointsInChunk}, {val: j}]});
                }

                if (l2Chunk==bits) {
                    if (fnFFTFinal) {
                        task.push({cmd: "ALLOCSET", var: 1, buff: inv});
                        task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                            {var: 0},
                            {val: pointsInChunk},
                            {var: 1},
                        ]});
                    }
                    if (fnMid2Out) {
                        task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                    }
                    task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
                } else {
                    task.push({cmd: "GET", out:0, var: 0, len: sMid*pointsInChunk});
                }
                promises.push(tm.queueAction(task).then( (r) => {
                    if (logger) logger.debug(`${loggerTxt}: fft ${bits} mix end: ${i}/${nChunks}`);
                    return r;
                }));
            }

            chunks = await Promise.all(promises);
            for (let i = 0; i< nChunks; i++) chunks[i] = chunks[i][0];

            for (let i = l2Chunk+1;   i<=bits; i++) {
                if (logger) logger.debug(`${loggerTxt}: fft  ${bits}  join: ${i}/${bits}`);
                const nGroups = 1 << (bits - i);
                const nChunksPerGroup = nChunks / nGroups;
                const opPromises = [];
                for (let j=0; j<nGroups; j++) {
                    for (let k=0; k <nChunksPerGroup/2; k++) {
                        const first = Fr.exp( Fr.w[i], k*pointsInChunk);
                        const inc = Fr.w[i];
                        const o1 = j*nChunksPerGroup + k;
                        const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                        const task = [];
                        task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                        task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                        task.push({cmd: "ALLOCSET", var: 2, buff: first});
                        task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                        task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                            {var: 0},
                            {var: 1},
                            {val: pointsInChunk},
                            {var: 2},
                            {var: 3}
                        ]});
                        if (i==bits) {
                            if (fnFFTFinal) {
                                task.push({cmd: "ALLOCSET", var: 4, buff: inv});
                                task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                    {var: 0},
                                    {val: pointsInChunk},
                                    {var: 4},
                                ]});
                                task.push({cmd: "CALL", fnName: fnFFTFinal,  params:[
                                    {var: 1},
                                    {val: pointsInChunk},
                                    {var: 4},
                                ]});
                            }
                            if (fnMid2Out) {
                                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: pointsInChunk}, {var: 0}]});
                                task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: pointsInChunk}, {var: 1}]});
                            }
                            task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sOut});
                            task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sOut});
                        } else {
                            task.push({cmd: "GET", out: 0, var: 0, len: pointsInChunk*sMid});
                            task.push({cmd: "GET", out: 1, var: 1, len: pointsInChunk*sMid});
                        }
                        opPromises.push(tm.queueAction(task).then( (r) => {
                            if (logger) logger.debug(`${loggerTxt}: fft ${bits} join  ${i}/${bits}  ${j+1}/${nGroups} ${k}/${nChunksPerGroup/2}`);
                            return r;
                        }));
                    }
                }

                const res = await Promise.all(opPromises);
                for (let j=0; j<nGroups; j++) {
                    for (let k=0; k <nChunksPerGroup/2; k++) {
                        const o1 = j*nChunksPerGroup + k;
                        const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                        const resChunk = res.shift();
                        chunks[o1] = resChunk[0];
                        chunks[o2] = resChunk[1];
                    }
                }
            }

            if (buff instanceof BigBuffer) {
                buffOut = new BigBuffer(nPoints*sOut);
            } else {
                buffOut = new Uint8Array(nPoints*sOut);
            }
            if (inverse) {
                buffOut.set(chunks[0].slice((pointsInChunk-1)*sOut));
                let p= sOut;
                for (let i=nChunks-1; i>0; i--) {
                    buffOut.set(chunks[i], p);
                    p += pointsInChunk*sOut;
                    delete chunks[i];  // Liberate mem
                }
                buffOut.set(chunks[0].slice(0, (pointsInChunk-1)*sOut), p);
                delete chunks[0];
            } else {
                for (let i=0; i<nChunks; i++) {
                    buffOut.set(chunks[i], pointsInChunk*sOut*i);
                    delete chunks[i];
                }
            }

            if (returnArray) {
                return curve.buffer2array(buffOut, sOut);
            } else {
                return buffOut;
            }
        }

        async function _fftExt(buff, inType, outType, logger, loggerTxt) {
            let b1, b2;
            b1 = buff.slice( 0 , buff.byteLength/2);
            b2 = buff.slice( buff.byteLength/2, buff.byteLength);

            const promises = [];

            [b1, b2] = await _fftJoinExt(b1, b2, "fftJoinExt", Fr.one, Fr.shift, inType, "jacobian", logger, loggerTxt);

            promises.push( _fft(b1, false, "jacobian", outType, logger, loggerTxt));
            promises.push( _fft(b2, false, "jacobian", outType, logger, loggerTxt));

            const res1 = await Promise.all(promises);

            let buffOut;
            if (res1[0].byteLength > (1<<28)) {
                buffOut = new BigBuffer(res1[0].byteLength*2);
            } else {
                buffOut = new Uint8Array(res1[0].byteLength*2);
            }

            buffOut.set(res1[0]);
            buffOut.set(res1[1], res1[0].byteLength);

            return buffOut;
        }

        async function _fftExtInv(buff, inType, outType, logger, loggerTxt) {
            let b1, b2;
            b1 = buff.slice( 0 , buff.byteLength/2);
            b2 = buff.slice( buff.byteLength/2, buff.byteLength);

            const promises = [];

            promises.push( _fft(b1, true, inType, "jacobian", logger, loggerTxt));
            promises.push( _fft(b2, true, inType, "jacobian", logger, loggerTxt));

            [b1, b2] = await Promise.all(promises);

            const res1 = await _fftJoinExt(b1, b2, "fftJoinExtInv", Fr.one, Fr.shiftInv, "jacobian", outType, logger, loggerTxt);

            let buffOut;
            if (res1[0].byteLength > (1<<28)) {
                buffOut = new BigBuffer(res1[0].byteLength*2);
            } else {
                buffOut = new Uint8Array(res1[0].byteLength*2);
            }

            buffOut.set(res1[0]);
            buffOut.set(res1[1], res1[0].byteLength);

            return buffOut;
        }


        async function _fftJoinExt(buff1, buff2, fn, first, inc, inType, outType, logger, loggerTxt) {
            const MAX_CHUNK_SIZE = 1<<16;
            const MIN_CHUNK_SIZE = 1<<4;

            let fnName;
            let fnIn2Mid, fnMid2Out;
            let sOut, sIn, sMid;

            if (groupName == "G1") {
                if (inType == "affine") {
                    sIn = G.F.n8*2;
                    fnIn2Mid = "g1m_batchToJacobian";
                } else {
                    sIn = G.F.n8*3;
                }
                sMid = G.F.n8*3;
                fnName = "g1m_"+fn;
                if (outType == "affine") {
                    fnMid2Out = "g1m_batchToAffine";
                    sOut = G.F.n8*2;
                } else {
                    sOut = G.F.n8*3;
                }
            } else if (groupName == "G2") {
                if (inType == "affine") {
                    sIn = G.F.n8*2;
                    fnIn2Mid = "g2m_batchToJacobian";
                } else {
                    sIn = G.F.n8*3;
                }
                fnName = "g2m_"+fn;
                sMid = G.F.n8*3;
                if (outType == "affine") {
                    fnMid2Out = "g2m_batchToAffine";
                    sOut = G.F.n8*2;
                } else {
                    sOut = G.F.n8*3;
                }
            } else if (groupName == "Fr") {
                sIn = Fr.n8;
                sOut = Fr.n8;
                sMid = Fr.n8;
                fnName = "frm_" + fn;
            } else {
                throw new Error("Invalid group");
            }

            if (buff1.byteLength != buff2.byteLength) {
                throw new Error("Invalid buffer size");
            }
            const nPoints = Math.floor(buff1.byteLength / sIn);
            if (nPoints != 1 << log2(nPoints)) {
                throw new Error("Invalid number of points");
            }

            let chunkSize = Math.floor(nPoints /tm.concurrency);
            if (chunkSize < MIN_CHUNK_SIZE) chunkSize = MIN_CHUNK_SIZE;
            if (chunkSize > MAX_CHUNK_SIZE) chunkSize = MAX_CHUNK_SIZE;

            const opPromises = [];

            for (let i=0; i<nPoints; i += chunkSize) {
                if (logger) logger.debug(`${loggerTxt}: fftJoinExt Start: ${i}/${nPoints}`);
                const n= Math.min(nPoints - i, chunkSize);

                const firstChunk = Fr.mul(first, Fr.exp( inc, i));
                const task = [];

                const b1 = buff1.slice(i*sIn, (i+n)*sIn);
                const b2 = buff2.slice(i*sIn, (i+n)*sIn);

                task.push({cmd: "ALLOC", var: 0, len: sMid*n});
                task.push({cmd: "SET", var: 0, buff: b1});
                task.push({cmd: "ALLOC", var: 1, len: sMid*n});
                task.push({cmd: "SET", var: 1, buff: b2});
                task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
                task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                if (fnIn2Mid) {
                    task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:0}, {val: n}, {var: 0}]});
                    task.push({cmd: "CALL", fnName:fnIn2Mid, params: [{var:1}, {val: n}, {var: 1}]});
                }
                task.push({cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {var: 1},
                    {val: n},
                    {var: 2},
                    {var: 3},
                    {val: Fr.s},
                ]});
                if (fnMid2Out) {
                    task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:0}, {val: n}, {var: 0}]});
                    task.push({cmd: "CALL", fnName:fnMid2Out, params: [{var:1}, {val: n}, {var: 1}]});
                }
                task.push({cmd: "GET", out: 0, var: 0, len: n*sOut});
                task.push({cmd: "GET", out: 1, var: 1, len: n*sOut});
                opPromises.push(
                    tm.queueAction(task).then( (r) => {
                        if (logger) logger.debug(`${loggerTxt}: fftJoinExt End: ${i}/${nPoints}`);
                        return r;
                    })
                );
            }

            const result = await Promise.all(opPromises);

            let fullBuffOut1;
            let fullBuffOut2;
            if (nPoints * sOut > 1<<28) {
                fullBuffOut1 = new BigBuffer(nPoints*sOut);
                fullBuffOut2 = new BigBuffer(nPoints*sOut);
            } else {
                fullBuffOut1 = new Uint8Array(nPoints*sOut);
                fullBuffOut2 = new Uint8Array(nPoints*sOut);
            }

            let p =0;
            for (let i=0; i<result.length; i++) {
                fullBuffOut1.set(result[i][0], p);
                fullBuffOut2.set(result[i][1], p);
                p+=result[i][0].byteLength;
            }

            return [fullBuffOut1, fullBuffOut2];
        }


        G.fft = async function(buff, inType, outType, logger, loggerTxt) {
            return await _fft(buff, false, inType, outType, logger, loggerTxt);
        };

        G.ifft = async function(buff, inType, outType, logger, loggerTxt) {
            return await _fft(buff, true, inType, outType, logger, loggerTxt);
        };

        G.lagrangeEvaluations = async function (buff, inType, outType, logger, loggerTxt) {
            inType = inType || "affine";
            outType = outType || "affine";

            let sIn;
            if (groupName == "G1") {
                if (inType == "affine") {
                    sIn = G.F.n8*2;
                } else {
                    sIn = G.F.n8*3;
                }
            } else if (groupName == "G2") {
                if (inType == "affine") {
                    sIn = G.F.n8*2;
                } else {
                    sIn = G.F.n8*3;
                }
            } else if (groupName == "Fr") {
                sIn = Fr.n8;
            } else {
                throw new Error("Invalid group");
            }

            const nPoints = buff.byteLength /sIn;
            const bits = log2(nPoints);

            if ((2 ** bits)*sIn != buff.byteLength) {
                if (logger) logger.error("lagrangeEvaluations iinvalid input size");
                throw new Error("lagrangeEvaluations invalid Input size");
            }

            if (bits <= Fr.s) {
                return await G.ifft(buff, inType, outType, logger, loggerTxt);
            }

            if (bits > Fr.s+1) {
                if (logger) logger.error("lagrangeEvaluations input too big");
                throw new Error("lagrangeEvaluations input too big");
            }

            let t0 = buff.slice(0, buff.byteLength/2);
            let t1 = buff.slice(buff.byteLength/2, buff.byteLength);


            const shiftToSmallM = Fr.exp(Fr.shift, nPoints/2);
            const sConst = Fr.inv( Fr.sub(Fr.one, shiftToSmallM));

            [t0, t1] = await _fftJoinExt(t0, t1, "prepareLagrangeEvaluation", sConst, Fr.shiftInv, inType, "jacobian", logger, loggerTxt + " prep");

            const promises = [];

            promises.push( _fft(t0, true, "jacobian", outType, logger, loggerTxt + " t0"));
            promises.push( _fft(t1, true, "jacobian", outType, logger, loggerTxt + " t1"));

            [t0, t1] = await Promise.all(promises);

            let buffOut;
            if (t0.byteLength > (1<<28)) {
                buffOut = new BigBuffer(t0.byteLength*2);
            } else {
                buffOut = new Uint8Array(t0.byteLength*2);
            }

            buffOut.set(t0);
            buffOut.set(t1, t0.byteLength);

            return buffOut;
        };

        G.fftMix = async function fftMix(buff) {
            const sG = G.F.n8*3;
            let fnName, fnFFTJoin;
            if (groupName == "G1") {
                fnName = "g1m_fftMix";
                fnFFTJoin = "g1m_fftJoin";
            } else if (groupName == "G2") {
                fnName = "g2m_fftMix";
                fnFFTJoin = "g2m_fftJoin";
            } else if (groupName == "Fr") {
                fnName = "frm_fftMix";
                fnFFTJoin = "frm_fftJoin";
            } else {
                throw new Error("Invalid group");
            }

            const nPoints = Math.floor(buff.byteLength / sG);
            const power = log2(nPoints);

            let nChunks = 1 << log2(tm.concurrency);

            if (nPoints <= nChunks*2) nChunks = 1;

            const pointsPerChunk = nPoints / nChunks;

            const powerChunk = log2(pointsPerChunk);

            const opPromises = [];
            for (let i=0; i<nChunks; i++) {
                const task = [];
                const b = buff.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
                task.push({cmd: "ALLOCSET", var: 0, buff: b});
                for (let j=1; j<=powerChunk; j++) {
                    task.push({cmd: "CALL", fnName: fnName, params: [
                        {var: 0},
                        {val: pointsPerChunk},
                        {val: j}
                    ]});
                }
                task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
                opPromises.push(
                    tm.queueAction(task)
                );
            }

            const result = await Promise.all(opPromises);

            const chunks = [];
            for (let i=0; i<result.length; i++) chunks[i] = result[i][0];


            for (let i = powerChunk+1; i<=power; i++) {
                const nGroups = 1 << (power - i);
                const nChunksPerGroup = nChunks / nGroups;
                const opPromises = [];
                for (let j=0; j<nGroups; j++) {
                    for (let k=0; k <nChunksPerGroup/2; k++) {
                        const first = Fr.exp( Fr.w[i], k*pointsPerChunk);
                        const inc = Fr.w[i];
                        const o1 = j*nChunksPerGroup + k;
                        const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;

                        const task = [];
                        task.push({cmd: "ALLOCSET", var: 0, buff: chunks[o1]});
                        task.push({cmd: "ALLOCSET", var: 1, buff: chunks[o2]});
                        task.push({cmd: "ALLOCSET", var: 2, buff: first});
                        task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                        task.push({cmd: "CALL", fnName: fnFFTJoin,  params:[
                            {var: 0},
                            {var: 1},
                            {val: pointsPerChunk},
                            {var: 2},
                            {var: 3}
                        ]});
                        task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
                        task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
                        opPromises.push(tm.queueAction(task));
                    }
                }

                const res = await Promise.all(opPromises);
                for (let j=0; j<nGroups; j++) {
                    for (let k=0; k <nChunksPerGroup/2; k++) {
                        const o1 = j*nChunksPerGroup + k;
                        const o2 = j*nChunksPerGroup + k + nChunksPerGroup/2;
                        const resChunk = res.shift();
                        chunks[o1] = resChunk[0];
                        chunks[o2] = resChunk[1];
                    }
                }
            }

            let fullBuffOut;
            if (buff instanceof BigBuffer) {
                fullBuffOut = new BigBuffer(nPoints*sG);
            } else {
                fullBuffOut = new Uint8Array(nPoints*sG);
            }
            let p =0;
            for (let i=0; i<nChunks; i++) {
                fullBuffOut.set(chunks[i], p);
                p+=chunks[i].byteLength;
            }

            return fullBuffOut;
        };

        G.fftJoin = async function fftJoin(buff1, buff2, first, inc) {
            const sG = G.F.n8*3;
            let fnName;
            if (groupName == "G1") {
                fnName = "g1m_fftJoin";
            } else if (groupName == "G2") {
                fnName = "g2m_fftJoin";
            } else if (groupName == "Fr") {
                fnName = "frm_fftJoin";
            } else {
                throw new Error("Invalid group");
            }

            if (buff1.byteLength != buff2.byteLength) {
                throw new Error("Invalid buffer size");
            }
            const nPoints = Math.floor(buff1.byteLength / sG);
            if (nPoints != 1 << log2(nPoints)) {
                throw new Error("Invalid number of points");
            }

            let nChunks = 1 << log2(tm.concurrency);
            if (nPoints <= nChunks*2) nChunks = 1;

            const pointsPerChunk = nPoints / nChunks;


            const opPromises = [];
            for (let i=0; i<nChunks; i++) {
                const task = [];

                const firstChunk = Fr.mul(first, Fr.exp(inc, i*pointsPerChunk));
                const b1 = buff1.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
                const b2 = buff2.slice((i* pointsPerChunk)*sG, ((i+1)* pointsPerChunk)*sG);
                task.push({cmd: "ALLOCSET", var: 0, buff: b1});
                task.push({cmd: "ALLOCSET", var: 1, buff: b2});
                task.push({cmd: "ALLOCSET", var: 2, buff: firstChunk});
                task.push({cmd: "ALLOCSET", var: 3, buff: inc});
                task.push({cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {var: 1},
                    {val: pointsPerChunk},
                    {var: 2},
                    {var: 3}
                ]});
                task.push({cmd: "GET", out: 0, var: 0, len: pointsPerChunk*sG});
                task.push({cmd: "GET", out: 1, var: 1, len: pointsPerChunk*sG});
                opPromises.push(
                    tm.queueAction(task)
                );

            }


            const result = await Promise.all(opPromises);

            let fullBuffOut1;
            let fullBuffOut2;
            if (buff1 instanceof BigBuffer) {
                fullBuffOut1 = new BigBuffer(nPoints*sG);
                fullBuffOut2 = new BigBuffer(nPoints*sG);
            } else {
                fullBuffOut1 = new Uint8Array(nPoints*sG);
                fullBuffOut2 = new Uint8Array(nPoints*sG);
            }

            let p =0;
            for (let i=0; i<result.length; i++) {
                fullBuffOut1.set(result[i][0], p);
                fullBuffOut2.set(result[i][1], p);
                p+=result[i][0].byteLength;
            }

            return [fullBuffOut1, fullBuffOut2];
        };



        G.fftFinal =  async function fftFinal(buff, factor) {
            const sG = G.F.n8*3;
            const sGout = G.F.n8*2;
            let fnName, fnToAffine;
            if (groupName == "G1") {
                fnName = "g1m_fftFinal";
                fnToAffine = "g1m_batchToAffine";
            } else if (groupName == "G2") {
                fnName = "g2m_fftFinal";
                fnToAffine = "g2m_batchToAffine";
            } else {
                throw new Error("Invalid group");
            }

            const nPoints = Math.floor(buff.byteLength / sG);
            if (nPoints != 1 << log2(nPoints)) {
                throw new Error("Invalid number of points");
            }

            const pointsPerChunk = Math.floor(nPoints / tm.concurrency);

            const opPromises = [];
            for (let i=0; i<tm.concurrency; i++) {
                let n;
                if (i< tm.concurrency-1) {
                    n = pointsPerChunk;
                } else {
                    n = nPoints - i*pointsPerChunk;
                }
                if (n==0) continue;
                const task = [];
                const b = buff.slice((i* pointsPerChunk)*sG, (i*pointsPerChunk+n)*sG);
                task.push({cmd: "ALLOCSET", var: 0, buff: b});
                task.push({cmd: "ALLOCSET", var: 1, buff: factor});
                task.push({cmd: "CALL", fnName: fnName, params: [
                    {var: 0},
                    {val: n},
                    {var: 1},
                ]});
                task.push({cmd: "CALL", fnName: fnToAffine, params: [
                    {var: 0},
                    {val: n},
                    {var: 0},
                ]});
                task.push({cmd: "GET", out: 0, var: 0, len: n*sGout});
                opPromises.push(
                    tm.queueAction(task)
                );

            }

            const result = await Promise.all(opPromises);

            let fullBuffOut;
            if (buff instanceof BigBuffer) {
                fullBuffOut = new BigBuffer(nPoints*sGout);
            } else {
                fullBuffOut = new Uint8Array(nPoints*sGout);
            }

            let p =0;
            for (let i=result.length-1; i>=0; i--) {
                fullBuffOut.set(result[i][0], p);
                p+=result[i][0].byteLength;
            }

            return fullBuffOut;
        };
    }

    async function buildEngine(params) {

        const tm = await buildThreadManager(params.wasm, params.singleThread);


        const curve = {};

        curve.q = e$2(params.wasm.q);
        curve.r = e$2(params.wasm.r);
        curve.name = params.name;
        curve.tm = tm;
        curve.prePSize = params.wasm.prePSize;
        curve.preQSize = params.wasm.preQSize;
        curve.Fr = new WasmField1(tm, "frm", params.n8r, params.r);
        curve.F1 = new WasmField1(tm, "f1m", params.n8q, params.q);
        curve.F2 = new WasmField2(tm, "f2m", curve.F1);
        curve.G1 = new WasmCurve(tm, "g1m", curve.F1, params.wasm.pG1gen, params.wasm.pG1b, params.cofactorG1);
        curve.G2 = new WasmCurve(tm, "g2m", curve.F2, params.wasm.pG2gen, params.wasm.pG2b, params.cofactorG2);
        curve.F6 = new WasmField3(tm, "f6m", curve.F2);
        curve.F12 = new WasmField2(tm, "ftm", curve.F6);

        curve.Gt = curve.F12;

        buildBatchApplyKey(curve, "G1");
        buildBatchApplyKey(curve, "G2");
        buildBatchApplyKey(curve, "Fr");

        buildMultiexp(curve, "G1");
        buildMultiexp(curve, "G2");

        buildFFT(curve, "G1");
        buildFFT(curve, "G2");
        buildFFT(curve, "Fr");

        buildPairing(curve);

        curve.array2buffer = function(arr, sG) {
            const buff = new Uint8Array(sG*arr.length);

            for (let i=0; i<arr.length; i++) {
                buff.set(arr[i], i*sG);
            }

            return buff;
        };

        curve.buffer2array = function(buff , sG) {
            const n= buff.byteLength / sG;
            const arr = new Array(n);
            for (let i=0; i<n; i++) {
                arr[i] = buff.slice(i*sG, i*sG+sG);
            }
            return arr;
        };

        return curve;
    }

    global.curve_bn128 = null;

    async function buildBn128(singleThread) {

        if ((!singleThread)&&(global.curve_bn128)) return global.curve_bn128;
        const params = {
            name: "bn128",
            wasm: wasmcurves.bn128_wasm,
            q: e$2("21888242871839275222246405745257275088696311157297823662689037894645226208583"),
            r: e$2("21888242871839275222246405745257275088548364400416034343698204186575808495617"),
            n8q: 32,
            n8r: 32,
            cofactorG2: e$2("30644e72e131a029b85045b68181585e06ceecda572a2489345f2299c0f9fa8d", 16),
            singleThread: singleThread ? true : false
        };

        const curve = await buildEngine(params);
        curve.terminate = async function() {
            if (!params.singleThread) {
                global.curve_bn128 = null;
                await this.tm.terminate();
            }
        };

        if (!singleThread) {
            global.curve_bn128 = curve;
        }

        return curve;
    }

    global.curve_bls12381 = null;

    async function buildBls12381(singleThread) {

        if ((!singleThread)&&(global.curve_bls12381)) return global.curve_bls12381;
        const params = {
            name: "bls12381",
            wasm: wasmcurves.bls12381_wasm,
            q: e$2("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16),
            r: e$2("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16),
            n8q: 48,
            n8r: 32,
            cofactorG1: e$2("0x396c8c005555e1568c00aaab0000aaab", 16),
            cofactorG2: e$2("0x5d543a95414e7f1091d50792876a202cd91de4547085abaa68a205b2e5a7ddfa628f1cb4d9e82ef21537e293a6691ae1616ec6e786f0c70cf1c38e31c7238e5", 16),
            singleThread: singleThread ? true : false
        };

        const curve = await buildEngine(params);
        curve.terminate = async function() {
            if (!params.singleThread) {
                global.curve_bls12381 = null;
                await this.tm.terminate();
            }
        };

        return curve;
    }

    const bls12381r = e$2("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16);
    const bn128r = e$2("21888242871839275222246405745257275088548364400416034343698204186575808495617");

    const bls12381q = e$2("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16);
    const bn128q = e$2("21888242871839275222246405745257275088696311157297823662689037894645226208583");

    async function getCurveFromR(r, singleThread) {
        let curve;
        if (eq$2(r, bn128r)) {
            curve = await buildBn128(singleThread);
        } else if (eq$2(r, bls12381r)) {
            curve = await buildBn128(singleThread);
        } else {
            throw new Error(`Curve not supported: ${toString(r)}`);
        }
        return curve;
    }

    const Scalar$1=_Scalar;
    const utils$1 = _utils;

    var fs = {};

    async function open(fileName, openFlags, cacheSize, pageSize) {
        cacheSize = cacheSize || 4096*64;
        if (["w+", "wx+", "r", "ax+", "a+"].indexOf(openFlags) <0)
            throw new Error("Invalid open option");
        const fd =await fs.promises.open(fileName, openFlags);

        const stats = await fd.stat();

        return  new FastFile(fd, stats, cacheSize, pageSize, fileName);
    }


    class FastFile {

        constructor(fd, stats, cacheSize, pageSize, fileName) {
            this.fileName = fileName;
            this.fd = fd;
            this.pos = 0;
            this.pageSize = pageSize || (1 << 8);
            while (this.pageSize < stats.blksize) {
                this.pageSize *= 2;
            }
            this.totalSize = stats.size;
            this.totalPages = Math.floor((stats.size -1) / this.pageSize)+1;
            this.maxPagesLoaded = Math.floor( cacheSize / this.pageSize)+1;
            this.pages = {};
            this.pendingLoads = [];
            this.writing = false;
            this.reading = false;
            this.avBuffs = [];
            this.history = {};
        }

        _loadPage(p) {
            const self = this;
            const P = new Promise((resolve, reject)=> {
                self.pendingLoads.push({
                    page: p,
                    resolve: resolve,
                    reject: reject
                });
            });
            self.__statusPage("After Load request: ", p);
            return P;
        }

        __statusPage(s, p) {
            const logEntry = [];
            const self=this;
            if (!self.logHistory) return;
            logEntry.push("==" + s+ " " +p);
            let S = "";
            for (let i=0; i<self.pendingLoads.length; i++) {
                if (self.pendingLoads[i].page == p) S = S + " " + i;
            }
            if (S) logEntry.push("Pending loads:"+S);
            if (typeof self.pages[p] != "undefined") {
                const page = self.pages[p];
                logEntry.push("Loaded");
                logEntry.push("pendingOps: "+page.pendingOps);
                if (page.loading) logEntry.push("loading: "+page.loading);
                if (page.writing) logEntry.push("writing");
                if (page.dirty) logEntry.push("dirty");
            }
            logEntry.push("==");

            if (!self.history[p]) self.history[p] = [];
            self.history[p].push(logEntry);
        }

        __printHistory(p) {
            const self = this;
            if (!self.history[p]) console.log("Empty History ", p);
            console.log("History "+p);
            for (let i=0; i<self.history[p].length; i++) {
                for (let j=0; j<self.history[p][i].length; j++) {
                    console.log("-> " + self.history[p][i][j]);
                }
            }
        }



        _triggerLoad() {
            const self = this;

            if (self.reading) return;
            if (self.pendingLoads.length==0) return;

            const pageIdxs = Object.keys(self.pages);

            const deletablePages = [];
            for (let i=0; i<pageIdxs.length; i++) {
                const page = self.pages[parseInt(pageIdxs[i])];
                if ((page.dirty == false)&&(page.pendingOps==0)&&(!page.writing)&&(!page.loading)) deletablePages.push(parseInt(pageIdxs[i]));
            }

            let freePages = self.maxPagesLoaded - pageIdxs.length;

            const ops = [];

            // while pending loads and
            //     the page is loaded or I can recover one.
            while (
                (self.pendingLoads.length>0) &&
                (   (typeof self.pages[self.pendingLoads[0].page] != "undefined" )
                  ||(  (freePages>0)
                     ||(deletablePages.length>0)))) {
                const load = self.pendingLoads.shift();
                if (typeof self.pages[load.page] != "undefined") {
                    self.pages[load.page].pendingOps ++;
                    const idx = deletablePages.indexOf(load.page);
                    if (idx>=0) deletablePages.splice(idx, 1);
                    if (self.pages[load.page].loading) {
                        self.pages[load.page].loading.push(load);
                    } else {
                        load.resolve();
                    }
                    self.__statusPage("After Load (cached): ", load.page);

                } else {
                    if (freePages) {
                        freePages--;
                    } else {
                        const fp = deletablePages.shift();
                        self.__statusPage("Before Unload: ", fp);
                        self.avBuffs.unshift(self.pages[fp]);
                        delete self.pages[fp];
                        self.__statusPage("After Unload: ", fp);
                    }

                    if (load.page>=self.totalPages) {
                        self.pages[load.page] = getNewPage();
                        load.resolve();
                        self.__statusPage("After Load (new): ", load.page);
                    } else {
                        self.reading = true;
                        self.pages[load.page] = getNewPage();
                        self.pages[load.page].loading = [load];
                        ops.push(self.fd.read(self.pages[load.page].buff, 0, self.pageSize, load.page*self.pageSize).then((res)=> {
                            self.pages[load.page].size = res.bytesRead;
                            const loading = self.pages[load.page].loading;
                            delete self.pages[load.page].loading;
                            for (let i=0; i<loading.length; i++) {
                                loading[i].resolve();
                            }
                            self.__statusPage("After Load (loaded): ", load.page);
                            return res;
                        }, (err) => {
                            load.reject(err);
                        }));
                        self.__statusPage("After Load (loading): ", load.page);
                    }
                }
            }
            // if (ops.length>1) console.log(ops.length);

            Promise.all(ops).then( () => {
                self.reading = false;
                if (self.pendingLoads.length>0) setImmediate(self._triggerLoad.bind(self));
                self._tryClose();
            });

            function getNewPage() {
                if (self.avBuffs.length>0) {
                    const p = self.avBuffs.shift();
                    p.dirty = false;
                    p.pendingOps = 1;
                    p.size =0;
                    return p;
                } else {
                    return {
                        dirty: false,
                        buff: new Uint8Array(self.pageSize),
                        pendingOps: 1,
                        size: 0
                    };
                }
            }

        }


        _triggerWrite() {
            const self = this;
            if (self.writing) return;

            const pageIdxs = Object.keys(self.pages);

            const ops = [];

            for (let i=0; i<pageIdxs.length; i++) {
                const page = self.pages[parseInt(pageIdxs[i])];
                if (page.dirty) {
                    page.dirty = false;
                    page.writing = true;
                    self.writing = true;
                    ops.push( self.fd.write(page.buff, 0, page.size, parseInt(pageIdxs[i])*self.pageSize).then(() => {
                        page.writing = false;
                        return;
                    }, (err) => {
                        console.log("ERROR Writing: "+err);
                        self.error = err;
                        self._tryClose();
                    }));
                }
            }

            if (self.writing) {
                Promise.all(ops).then( () => {
                    self.writing = false;
                    setImmediate(self._triggerWrite.bind(self));
                    self._tryClose();
                    if (self.pendingLoads.length>0) setImmediate(self._triggerLoad.bind(self));
                });
            }
        }

        _getDirtyPage() {
            for (let p in this.pages) {
                if (this.pages[p].dirty) return p;
            }
            return -1;
        }

        async write(buff, pos) {
            if (buff.byteLength == 0) return;
            const self = this;
    /*
            if (buff.byteLength > self.pageSize*self.maxPagesLoaded*0.8) {
                const cacheSize = Math.floor(buff.byteLength * 1.1);
                this.maxPagesLoaded = Math.floor( cacheSize / self.pageSize)+1;
            }
    */
            if (typeof pos == "undefined") pos = self.pos;
            self.pos = pos+buff.byteLength;
            if (self.totalSize < pos + buff.byteLength) self.totalSize = pos + buff.byteLength;
            if (self.pendingClose)
                throw new Error("Writing a closing file");
            const firstPage = Math.floor(pos / self.pageSize);
            const lastPage = Math.floor((pos + buff.byteLength -1) / self.pageSize);

            const pagePromises = [];
            for (let i=firstPage; i<=lastPage; i++) pagePromises.push(self._loadPage(i));
            self._triggerLoad();

            let p = firstPage;
            let o = pos % self.pageSize;
            let r = buff.byteLength;
            while (r>0) {
                await pagePromises[p-firstPage];
                const l = (o+r > self.pageSize) ? (self.pageSize -o) : r;
                const srcView = buff.slice( buff.byteLength - r, buff.byteLength - r + l);
                const dstView = new Uint8Array(self.pages[p].buff.buffer, o, l);
                dstView.set(srcView);
                self.pages[p].dirty = true;
                self.pages[p].pendingOps --;
                self.pages[p].size = Math.max(o+l, self.pages[p].size);
                if (p>=self.totalPages) {
                    self.totalPages = p+1;
                }
                r = r-l;
                p ++;
                o = 0;
                if (!self.writing) setImmediate(self._triggerWrite.bind(self));
            }
        }

        async read(len, pos) {
            const self = this;
            let buff = new Uint8Array(len);
            await self.readToBuffer(buff, 0, len, pos);

            return buff;
        }

        async readToBuffer(buffDst, offset, len, pos) {
            if (len == 0) {
                return;
            }
            const self = this;
            if (len > self.pageSize*self.maxPagesLoaded*0.8) {
                const cacheSize = Math.floor(len * 1.1);
                this.maxPagesLoaded = Math.floor( cacheSize / self.pageSize)+1;
            }
            if (typeof pos == "undefined") pos = self.pos;
            self.pos = pos+len;
            if (self.pendingClose)
                throw new Error("Reading a closing file");
            const firstPage = Math.floor(pos / self.pageSize);
            const lastPage = Math.floor((pos + len -1) / self.pageSize);

            const pagePromises = [];
            for (let i=firstPage; i<=lastPage; i++) pagePromises.push(self._loadPage(i));

            self._triggerLoad();

            let p = firstPage;
            let o = pos % self.pageSize;
            // Remaining bytes to read
            let r = pos + len > self.totalSize ? len - (pos + len - self.totalSize): len;
            while (r>0) {
                await pagePromises[p - firstPage];
                self.__statusPage("After Await (read): ", p);

                // bytes to copy from this page
                const l = (o+r > self.pageSize) ? (self.pageSize -o) : r;
                const srcView = new Uint8Array(self.pages[p].buff.buffer, self.pages[p].buff.byteOffset + o, l);
                buffDst.set(srcView, offset+len-r);
                self.pages[p].pendingOps --;

                self.__statusPage("After Op done: ", p);

                r = r-l;
                p ++;
                o = 0;
                if (self.pendingLoads.length>0) setImmediate(self._triggerLoad.bind(self));
            }

            this.pos = pos + len;

        }


        _tryClose() {
            const self = this;
            if (!self.pendingClose) return;
            if (self.error) {
                self.pendingCloseReject(self.error);
            }
            const p = self._getDirtyPage();
            if ((p>=0) || (self.writing) || (self.reading) || (self.pendingLoads.length>0)) return;
            self.pendingClose();
        }

        close() {
            const self = this;
            if (self.pendingClose)
                throw new Error("Closing the file twice");
            return new Promise((resolve, reject) => {
                self.pendingClose = resolve;
                self.pendingCloseReject = reject;
                self._tryClose();
            }).then(()=> {
                self.fd.close();
            }, (err) => {
                self.fd.close();
                throw (err);
            });
        }

        async discard() {
            const self = this;
            await self.close();
            await fs.promises.unlink(this.fileName);
        }

        async writeULE32(v, pos) {
            const self = this;
            const tmpBuff32 = new Uint8Array(4);
            const tmpBuff32v = new DataView(tmpBuff32.buffer);

            tmpBuff32v.setUint32(0, v, true);

            await self.write(tmpBuff32, pos);
        }

        async writeUBE32(v, pos) {
            const self = this;

            const tmpBuff32 = new Uint8Array(4);
            const tmpBuff32v = new DataView(tmpBuff32.buffer);

            tmpBuff32v.setUint32(0, v, false);

            await self.write(tmpBuff32, pos);
        }


        async writeULE64(v, pos) {
            const self = this;

            const tmpBuff64 = new Uint8Array(8);
            const tmpBuff64v = new DataView(tmpBuff64.buffer);

            tmpBuff64v.setUint32(0, v & 0xFFFFFFFF, true);
            tmpBuff64v.setUint32(4, Math.floor(v / 0x100000000) , true);

            await self.write(tmpBuff64, pos);
        }

        async readULE32(pos) {
            const self = this;
            const b = await self.read(4, pos);

            const view = new Uint32Array(b.buffer);

            return view[0];
        }

        async readUBE32(pos) {
            const self = this;
            const b = await self.read(4, pos);

            const view = new DataView(b.buffer);

            return view.getUint32(0, false);
        }

        async readULE64(pos) {
            const self = this;
            const b = await self.read(8, pos);

            const view = new Uint32Array(b.buffer);

            return view[1] * 0x100000000 + view[0];
        }

    }

    function createNew(o) {
        const initialSize = o.initialSize || 1<<20;
        const fd = new MemFile();
        fd.o = o;
        fd.o.data = new Uint8Array(initialSize);
        fd.allocSize = initialSize;
        fd.totalSize = 0;
        fd.readOnly = false;
        fd.pos = 0;
        return fd;
    }

    function readExisting(o) {
        const fd = new MemFile();
        fd.o = o;
        fd.allocSize = o.data.byteLength;
        fd.totalSize = o.data.byteLength;
        fd.readOnly = true;
        fd.pos = 0;
        return fd;
    }

    const tmpBuff32 = new Uint8Array(4);
    const tmpBuff32v = new DataView(tmpBuff32.buffer);
    const tmpBuff64 = new Uint8Array(8);
    const tmpBuff64v = new DataView(tmpBuff64.buffer);

    class MemFile {

        constructor() {
            this.pageSize = 1 << 14;  // for compatibility
        }

        _resizeIfNeeded(newLen) {
            if (newLen > this.allocSize) {
                const newAllocSize = Math.max(
                    this.allocSize + (1 << 20),
                    Math.floor(this.allocSize * 1.1),
                    newLen
                );
                const newData = new Uint8Array(newAllocSize);
                newData.set(this.o.data);
                this.o.data = newData;
                this.allocSize = newAllocSize;
            }
        }

        async write(buff, pos) {
            const self =this;
            if (typeof pos == "undefined") pos = self.pos;
            if (this.readOnly) throw new Error("Writing a read only file");

            this._resizeIfNeeded(pos + buff.byteLength);

            this.o.data.set(buff.slice(), pos);

            if (pos + buff.byteLength > this.totalSize) this.totalSize = pos + buff.byteLength;

            this.pos = pos + buff.byteLength;
        }

        async readToBuffer(buffDest, offset, len, pos) {
            const self = this;
            if (typeof pos == "undefined") pos = self.pos;
            if (this.readOnly) {
                if (pos + len > this.totalSize) throw new Error("Reading out of bounds");
            }
            this._resizeIfNeeded(pos + len);

            const buffSrc = new Uint8Array(this.o.data.buffer, this.o.data.byteOffset + pos, len);

            buffDest.set(buffSrc, offset);

            this.pos = pos + len;
        }

        async read(len, pos) {
            const self = this;

            const buff = new Uint8Array(len);
            await self.readToBuffer(buff, 0, len, pos);

            return buff;
        }

        close() {
            if (this.o.data.byteLength != this.totalSize) {
                this.o.data = this.o.data.slice(0, this.totalSize);
            }
        }

        async discard() {
        }


        async writeULE32(v, pos) {
            const self = this;

            tmpBuff32v.setUint32(0, v, true);

            await self.write(tmpBuff32, pos);
        }

        async writeUBE32(v, pos) {
            const self = this;

            tmpBuff32v.setUint32(0, v, false);

            await self.write(tmpBuff32, pos);
        }


        async writeULE64(v, pos) {
            const self = this;

            tmpBuff64v.setUint32(0, v & 0xFFFFFFFF, true);
            tmpBuff64v.setUint32(4, Math.floor(v / 0x100000000) , true);

            await self.write(tmpBuff64, pos);
        }


        async readULE32(pos) {
            const self = this;
            const b = await self.read(4, pos);

            const view = new Uint32Array(b.buffer);

            return view[0];
        }

        async readUBE32(pos) {
            const self = this;
            const b = await self.read(4, pos);

            const view = new DataView(b.buffer);

            return view.getUint32(0, false);
        }

        async readULE64(pos) {
            const self = this;
            const b = await self.read(8, pos);

            const view = new Uint32Array(b.buffer);

            return view[1] * 0x100000000 + view[0];
        }

    }

    const PAGE_SIZE$1 = 1<<22;

    function createNew$1(o) {
        const initialSize = o.initialSize || 0;
        const fd = new BigMemFile();
        fd.o = o;
        const nPages = initialSize ? Math.floor((initialSize - 1) / PAGE_SIZE$1)+1 : 0;
        fd.o.data = [];
        for (let i=0; i<nPages-1; i++) {
            fd.o.data.push( new Uint8Array(PAGE_SIZE$1));
        }
        if (nPages) fd.o.data.push( new Uint8Array(initialSize - PAGE_SIZE$1*(nPages-1)));
        fd.totalSize = 0;
        fd.readOnly = false;
        fd.pos = 0;
        return fd;
    }

    function readExisting$1(o) {
        const fd = new BigMemFile();
        fd.o = o;
        fd.totalSize = (o.data.length-1)* PAGE_SIZE$1 + o.data[o.data.length-1].byteLength;
        fd.readOnly = true;
        fd.pos = 0;
        return fd;
    }

    const tmpBuff32$1 = new Uint8Array(4);
    const tmpBuff32v$1 = new DataView(tmpBuff32$1.buffer);
    const tmpBuff64$1 = new Uint8Array(8);
    const tmpBuff64v$1 = new DataView(tmpBuff64$1.buffer);

    class BigMemFile {

        constructor() {
            this.pageSize = 1 << 14;  // for compatibility
        }

        _resizeIfNeeded(newLen) {

            if (newLen <= this.totalSize) return;

            if (this.readOnly) throw new Error("Reading out of file bounds");

            const nPages = Math.floor((newLen - 1) / PAGE_SIZE$1)+1;
            for (let i= Math.max(this.o.data.length-1, 0); i<nPages; i++) {
                const newSize = i<nPages-1 ? PAGE_SIZE$1 : newLen - (nPages-1)*PAGE_SIZE$1;
                const p = new Uint8Array(newSize);
                if (i == this.o.data.length-1) p.set(this.o.data[i]);
                this.o.data[i] = p;
            }
            this.totalSize = newLen;
        }

        async write(buff, pos) {
            const self =this;
            if (typeof pos == "undefined") pos = self.pos;
            if (this.readOnly) throw new Error("Writing a read only file");

            this._resizeIfNeeded(pos + buff.byteLength);

            const firstPage = Math.floor(pos / PAGE_SIZE$1);

            let p = firstPage;
            let o = pos % PAGE_SIZE$1;
            let r = buff.byteLength;
            while (r>0) {
                const l = (o+r > PAGE_SIZE$1) ? (PAGE_SIZE$1 -o) : r;
                const srcView = buff.slice(buff.byteLength - r, buff.byteLength - r + l);
                const dstView = new Uint8Array(self.o.data[p].buffer, o, l);
                dstView.set(srcView);
                r = r-l;
                p ++;
                o = 0;
            }

            this.pos = pos + buff.byteLength;
        }

        async readToBuffer(buffDst, offset, len, pos) {
            const self = this;
            if (typeof pos == "undefined") pos = self.pos;
            if (this.readOnly) {
                if (pos + len > this.totalSize) throw new Error("Reading out of bounds");
            }
            this._resizeIfNeeded(pos + len);

            const firstPage = Math.floor(pos / PAGE_SIZE$1);

            let p = firstPage;
            let o = pos % PAGE_SIZE$1;
            // Remaining bytes to read
            let r = len;
            while (r>0) {
                // bytes to copy from this page
                const l = (o+r > PAGE_SIZE$1) ? (PAGE_SIZE$1 -o) : r;
                const srcView = new Uint8Array(self.o.data[p].buffer, o, l);
                buffDst.set(srcView, offset+len-r);
                r = r-l;
                p ++;
                o = 0;
            }

            this.pos = pos + len;
        }

        async read(len, pos) {
            const self = this;
            const buff = new Uint8Array(len);

            await self.readToBuffer(buff, 0, len, pos);

            return buff;
        }

        close() {
        }

        async discard() {
        }


        async writeULE32(v, pos) {
            const self = this;

            tmpBuff32v$1.setUint32(0, v, true);

            await self.write(tmpBuff32$1, pos);
        }

        async writeUBE32(v, pos) {
            const self = this;

            tmpBuff32v$1.setUint32(0, v, false);

            await self.write(tmpBuff32$1, pos);
        }


        async writeULE64(v, pos) {
            const self = this;

            tmpBuff64v$1.setUint32(0, v & 0xFFFFFFFF, true);
            tmpBuff64v$1.setUint32(4, Math.floor(v / 0x100000000) , true);

            await self.write(tmpBuff64$1, pos);
        }


        async readULE32(pos) {
            const self = this;
            const b = await self.read(4, pos);

            const view = new Uint32Array(b.buffer);

            return view[0];
        }

        async readUBE32(pos) {
            const self = this;
            const b = await self.read(4, pos);

            const view = new DataView(b.buffer);

            return view.getUint32(0, false);
        }

        async readULE64(pos) {
            const self = this;
            const b = await self.read(8, pos);

            const view = new Uint32Array(b.buffer);

            return view[1] * 0x100000000 + view[0];
        }

    }

    /* global fetch */

    const DEFAULT_CACHE_SIZE = (1 << 16);
    const DEFAULT_PAGE_SIZE = (1 << 13);


    async function createOverride(o, b, c) {
        if (typeof o === "string") {
            o = {
                type: "file",
                fileName: o,
                cacheSize: b || DEFAULT_CACHE_SIZE,
                pageSize: c || DEFAULT_PAGE_SIZE
            };
        }
        if (o.type == "file") {
            return await open(o.fileName, "w+", o.cacheSize, o.pageSize);
        } else if (o.type == "mem") {
            return createNew(o);
        } else if (o.type == "bigMem") {
            return createNew$1(o);
        } else {
            throw new Error("Invalid FastFile type: "+o.type);
        }
    }

    async function readExisting$2(o, b, c) {
        if (o instanceof Uint8Array) {
            o = {
                type: "mem",
                data: o
            };
        }
        {
            if (typeof o === "string") {
                const buff = await fetch(o).then( function(res) {
                    return res.arrayBuffer();
                }).then(function (ab) {
                    return new Uint8Array(ab);
                });
                o = {
                    type: "mem",
                    data: buff
                };
            }
        }
        if (o.type == "file") {
            return await open(o.fileName, "r", o.cacheSize, o.pageSize);
        } else if (o.type == "mem") {
            return await readExisting(o);
        } else if (o.type == "bigMem") {
            return await readExisting$1(o);
        } else {
            throw new Error("Invalid FastFile type: "+o.type);
        }
    }

    async function readBinFile(fileName, type, maxVersion, cacheSize, pageSize) {

        const fd = await readExisting$2(fileName);

        const b = await fd.read(4);
        let readedType = "";
        for (let i=0; i<4; i++) readedType += String.fromCharCode(b[i]);

        if (readedType != type) throw new Error(fileName + ": Invalid File format");

        let v = await fd.readULE32();

        if (v>maxVersion) throw new Error("Version not supported");

        const nSections = await fd.readULE32();

        // Scan sections
        let sections = [];
        for (let i=0; i<nSections; i++) {
            let ht = await fd.readULE32();
            let hl = await fd.readULE64();
            if (typeof sections[ht] == "undefined") sections[ht] = [];
            sections[ht].push({
                p: fd.pos,
                size: hl
            });
            fd.pos += hl;
        }

        return {fd, sections};
    }

    async function createBinFile(fileName, type, version, nSections, cacheSize, pageSize) {

        const fd = await createOverride(fileName, cacheSize, pageSize);

        const buff = new Uint8Array(4);
        for (let i=0; i<4; i++) buff[i] = type.charCodeAt(i);
        await fd.write(buff, 0); // Magic "r1cs"

        await fd.writeULE32(version); // Version
        await fd.writeULE32(nSections); // Number of Sections

        return fd;
    }

    async function startWriteSection(fd, idSection) {
        if (typeof fd.writingSection !== "undefined") throw new Error("Already writing a section");
        await fd.writeULE32(idSection); // Header type
        fd.writingSection = {
            pSectionSize: fd.pos
        };
        await fd.writeULE64(0); // Temporally set to 0 length
    }

    async function endWriteSection(fd) {
        if (typeof fd.writingSection === "undefined") throw new Error("Not writing a section");

        const sectionSize = fd.pos - fd.writingSection.pSectionSize - 8;
        const oldPos = fd.pos;
        fd.pos = fd.writingSection.pSectionSize;
        await fd.writeULE64(sectionSize);
        fd.pos = oldPos;
        delete fd.writingSection;
    }

    async function startReadUniqueSection(fd, sections, idSection) {
        if (typeof fd.readingSection !== "undefined") throw new Error("Already reading a section");
        if (!sections[idSection])  throw new Error(fd.fileName + ": Missing section "+ idSection );
        if (sections[idSection].length>1) throw new Error(fd.fileName +": Section Duplicated " +idSection);

        fd.pos = sections[idSection][0].p;

        fd.readingSection = sections[idSection][0];
    }

    async function endReadSection(fd, noCheck) {
        if (typeof fd.readingSection === "undefined") throw new Error("Not reading a section");
        if (!noCheck) {
            if (fd.pos-fd.readingSection.p !=  fd.readingSection.size) throw new Error("Invalid section size reading");
        }
        delete fd.readingSection;
    }

    async function writeBigInt(fd, n, n8, pos) {
        const buff = new Uint8Array(n8);
        Scalar$1.toRprLE(buff, 0, n, n8);
        await fd.write(buff, pos);
    }

    async function readBigInt(fd, n8, pos) {
        const buff = await fd.read(n8, pos);
        return Scalar$1.fromRprLE(buff, 0, n8);
    }

    async function copySection(fdFrom, sections, fdTo, sectionId, size) {
        if (typeof size === "undefined") {
            size = sections[sectionId][0].size;
        }
        const chunkSize = fdFrom.pageSize;
        await startReadUniqueSection(fdFrom, sections, sectionId);
        await startWriteSection(fdTo, sectionId);
        for (let p=0; p<size; p+=chunkSize) {
            const l = Math.min(size -p, chunkSize);
            const buff = await fdFrom.read(l);
            await fdTo.write(buff);
        }
        await endWriteSection(fdTo);
        await endReadSection(fdFrom, size != sections[sectionId][0].size);

    }

    async function readSection(fd, sections, idSection, offset, length) {

        offset = (typeof offset === "undefined") ? 0 : offset;
        length = (typeof length === "undefined") ? sections[idSection][0].size - offset : length;

        if (offset + length > sections[idSection][0].size) {
            throw new Error("Reading out of the range of the section");
        }

        let buff;
        if (length < (1 << 30) ) {
            buff = new Uint8Array(length);
        } else {
            buff = new BigBuffer(length);
        }

        await fd.readToBuffer(buff, 0, length, sections[idSection][0].p + offset);
        return buff;
    }

    async function sectionIsEqual(fd1, sections1, fd2, sections2, idSection) {
        const MAX_BUFF_SIZE = fd1.pageSize * 16;
        await startReadUniqueSection(fd1, sections1, idSection);
        await startReadUniqueSection(fd2, sections2, idSection);
        if (sections1[idSection][0].size != sections2[idSection][0].size) return false;
        const totalBytes=sections1[idSection][0].size;
        for (let i=0; i<totalBytes; i+= MAX_BUFF_SIZE) {
            const n = Math.min(totalBytes-i, MAX_BUFF_SIZE);
            const buff1 = await fd1.read(n);
            const buff2 = await fd2.read(n);
            for (let j=0; j<n; j++) if (buff1[j] != buff2[j]) return false;
        }
        await endReadSection(fd1);
        await endReadSection(fd2);
        return true;
    }

    const bls12381r$1 = Scalar$1.e("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16);
    const bn128r$1 = Scalar$1.e("21888242871839275222246405745257275088548364400416034343698204186575808495617");

    const bls12381q$1 = Scalar$1.e("1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab", 16);
    const bn128q$1 = Scalar$1.e("21888242871839275222246405745257275088696311157297823662689037894645226208583");

    async function getCurveFromQ(q) {
        let curve;
        if (Scalar$1.eq(q, bn128q$1)) {
            curve = await buildBn128();
        } else if (Scalar$1.eq(q, bls12381q$1)) {
            curve = await buildBls12381();
        } else {
            throw new Error(`Curve not supported: ${Scalar$1.toString(q)}`);
        }
        return curve;
    }

    async function getCurveFromName(name) {
        let curve;
        const normName = normalizeName(name);
        if (["BN128", "BN254", "ALTBN128"].indexOf(normName) >= 0) {
            curve = await buildBn128();
        } else if (["BLS12381"].indexOf(normName) >= 0) {
            curve = await buildBls12381();
        } else {
            throw new Error(`Curve not supported: ${name}`);
        }
        return curve;

        function normalizeName(n) {
            return n.toUpperCase().match(/[A-Za-z0-9]+/g).join("");
        }

    }

    assert.notEqual = notEqual;
    assert.notOk = notOk;
    assert.equal = equal;
    assert.ok = assert;

    var nanoassert = assert;

    function equal (a, b, m) {
      assert(a == b, m); // eslint-disable-line eqeqeq
    }

    function notEqual (a, b, m) {
      assert(a != b, m); // eslint-disable-line eqeqeq
    }

    function notOk (t, m) {
      assert(!t, m);
    }

    function assert (t, m) {
      if (!t) throw new Error(m || 'AssertionError')
    }

    var blake2b = loadWebAssembly;

    loadWebAssembly.supported = typeof WebAssembly !== 'undefined';

    function loadWebAssembly (opts) {
      if (!loadWebAssembly.supported) return null

      var imp = opts && opts.imports;
      var wasm = toUint8Array('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');
      var ready = null;

      var mod = {
        buffer: wasm,
        memory: null,
        exports: null,
        realloc: realloc,
        onload: onload
      };

      onload(function () {});

      return mod

      function realloc (size) {
        mod.exports.memory.grow(Math.max(0, Math.ceil(Math.abs(size - mod.memory.length) / 65536)));
        mod.memory = new Uint8Array(mod.exports.memory.buffer);
      }

      function onload (cb) {
        if (mod.exports) return cb()

        if (ready) {
          ready.then(cb.bind(null, null)).catch(cb);
          return
        }

        try {
          if (opts && opts.async) throw new Error('async')
          setup({instance: new WebAssembly.Instance(new WebAssembly.Module(wasm), imp)});
        } catch (err) {
          ready = WebAssembly.instantiate(wasm, imp).then(setup);
        }

        onload(cb);
      }

      function setup (w) {
        mod.exports = w.instance.exports;
        mod.memory = mod.exports.memory && mod.exports.memory.buffer && new Uint8Array(mod.exports.memory.buffer);
      }
    }

    function toUint8Array (s) {
      if (typeof atob === 'function') return new Uint8Array(atob(s).split('').map(charCodeAt))
      return (commonjsRequire('buf' + 'fer').Buffer).from(s, 'base64')
    }

    function charCodeAt (c) {
      return c.charCodeAt(0)
    }

    var blake2bWasm = createCommonjsModule(function (module) {
    var wasm = blake2b();

    var head = 64;
    var freeList = [];

    module.exports = Blake2b;
    var BYTES_MIN = module.exports.BYTES_MIN = 16;
    var BYTES_MAX = module.exports.BYTES_MAX = 64;
    var BYTES = module.exports.BYTES = 32;
    var KEYBYTES_MIN = module.exports.KEYBYTES_MIN = 16;
    var KEYBYTES_MAX = module.exports.KEYBYTES_MAX = 64;
    var KEYBYTES = module.exports.KEYBYTES = 32;
    var SALTBYTES = module.exports.SALTBYTES = 16;
    var PERSONALBYTES = module.exports.PERSONALBYTES = 16;

    function Blake2b (digestLength, key, salt, personal, noAssert) {
      if (!(this instanceof Blake2b)) return new Blake2b(digestLength, key, salt, personal, noAssert)
      if (!(wasm && wasm.exports)) throw new Error('WASM not loaded. Wait for Blake2b.ready(cb)')
      if (!digestLength) digestLength = 32;

      if (noAssert !== true) {
        nanoassert(digestLength >= BYTES_MIN, 'digestLength must be at least ' + BYTES_MIN + ', was given ' + digestLength);
        nanoassert(digestLength <= BYTES_MAX, 'digestLength must be at most ' + BYTES_MAX + ', was given ' + digestLength);
        if (key != null) {
          nanoassert(key instanceof Uint8Array, 'key must be Uint8Array or Buffer');
          nanoassert(key.length >= KEYBYTES_MIN, 'key must be at least ' + KEYBYTES_MIN + ', was given ' + key.length);
          nanoassert(key.length <= KEYBYTES_MAX, 'key must be at least ' + KEYBYTES_MAX + ', was given ' + key.length);
        }
        if (salt != null) {
          nanoassert(salt instanceof Uint8Array, 'salt must be Uint8Array or Buffer');
          nanoassert(salt.length === SALTBYTES, 'salt must be exactly ' + SALTBYTES + ', was given ' + salt.length);
        }
        if (personal != null) {
          nanoassert(personal instanceof Uint8Array, 'personal must be Uint8Array or Buffer');
          nanoassert(personal.length === PERSONALBYTES, 'personal must be exactly ' + PERSONALBYTES + ', was given ' + personal.length);
        }
      }

      if (!freeList.length) {
        freeList.push(head);
        head += 216;
      }

      this.digestLength = digestLength;
      this.finalized = false;
      this.pointer = freeList.pop();

      wasm.memory.fill(0, 0, 64);
      wasm.memory[0] = this.digestLength;
      wasm.memory[1] = key ? key.length : 0;
      wasm.memory[2] = 1; // fanout
      wasm.memory[3] = 1; // depth

      if (salt) wasm.memory.set(salt, 32);
      if (personal) wasm.memory.set(personal, 48);

      if (this.pointer + 216 > wasm.memory.length) wasm.realloc(this.pointer + 216); // we need 216 bytes for the state
      wasm.exports.blake2b_init(this.pointer, this.digestLength);

      if (key) {
        this.update(key);
        wasm.memory.fill(0, head, head + key.length); // whiteout key
        wasm.memory[this.pointer + 200] = 128;
      }
    }


    Blake2b.prototype.update = function (input) {
      nanoassert(this.finalized === false, 'Hash instance finalized');
      nanoassert(input instanceof Uint8Array, 'input must be Uint8Array or Buffer');

      if (head + input.length > wasm.memory.length) wasm.realloc(head + input.length);
      wasm.memory.set(input, head);
      wasm.exports.blake2b_update(this.pointer, head, head + input.length);
      return this
    };

    Blake2b.prototype.getPartialHash = function () {
      return wasm.memory.slice(this.pointer, this.pointer+216);
    };

    Blake2b.prototype.setPartialHash = function (ph) {
      wasm.memory.set(ph, this.pointer);
    };


    Blake2b.prototype.digest = function (enc) {
      nanoassert(this.finalized === false, 'Hash instance finalized');
      this.finalized = true;

      freeList.push(this.pointer);
      wasm.exports.blake2b_final(this.pointer);

      if (!enc || enc === 'binary') {
        return wasm.memory.slice(this.pointer + 128, this.pointer + 128 + this.digestLength)
      }

      if (enc === 'hex') {
        return hexSlice(wasm.memory, this.pointer + 128, this.digestLength)
      }

      nanoassert(enc instanceof Uint8Array && enc.length >= this.digestLength, 'input must be Uint8Array or Buffer');
      for (var i = 0; i < this.digestLength; i++) {
        enc[i] = wasm.memory[this.pointer + 128 + i];
      }

      return enc
    };

    // libsodium compat
    Blake2b.prototype.final = Blake2b.prototype.digest;

    Blake2b.WASM = wasm && wasm.buffer;
    Blake2b.SUPPORTED = typeof WebAssembly !== 'undefined';

    Blake2b.ready = function (cb) {
      if (!cb) cb = noop;
      if (!wasm) return cb(new Error('WebAssembly not supported'))

      // backwards compat, can be removed in a new major
      var p = new Promise(function (reject, resolve) {
        wasm.onload(function (err) {
          if (err) resolve();
          else reject();
          cb(err);
        });
      });

      return p
    };

    Blake2b.prototype.ready = Blake2b.ready;

    function noop () {}

    function hexSlice (buf, start, len) {
      var str = '';
      for (var i = 0; i < len; i++) str += toHex(buf[start + i]);
      return str
    }

    function toHex (n) {
      if (n < 16) return '0' + n.toString(16)
      return n.toString(16)
    }
    });

    /* global window */

    const _revTable$2 = [];
    for (let i=0; i<256; i++) {
        _revTable$2[i] = _revSlow$2(i, 8);
    }

    function _revSlow$2(idx, bits) {
        let res =0;
        let a = idx;
        for (let i=0; i<bits; i++) {
            res <<= 1;
            res = res | (a &1);
            a >>=1;
        }
        return res;
    }


    function log2$1( V )
    {
        return( ( ( V & 0xFFFF0000 ) !== 0 ? ( V &= 0xFFFF0000, 16 ) : 0 ) | ( ( V & 0xFF00FF00 ) !== 0 ? ( V &= 0xFF00FF00, 8 ) : 0 ) | ( ( V & 0xF0F0F0F0 ) !== 0 ? ( V &= 0xF0F0F0F0, 4 ) : 0 ) | ( ( V & 0xCCCCCCCC ) !== 0 ? ( V &= 0xCCCCCCCC, 2 ) : 0 ) | ( ( V & 0xAAAAAAAA ) !== 0 ) );
    }


    function formatHash(b, title) {
        const a = new DataView(b.buffer, b.byteOffset, b.byteLength);
        let S = "";
        for (let i=0; i<4; i++) {
            if (i>0) S += "\n";
            S += "\t\t";
            for (let j=0; j<4; j++) {
                if (j>0) S += " ";
                S += a.getUint32(i*16+j*4).toString(16).padStart(8, "0");
            }
        }
        if (title) S = title + "\n" + S;
        return S;
    }

    function hashIsEqual(h1, h2) {
        if (h1.byteLength != h2.byteLength) return false;
        var dv1 = new Int8Array(h1);
        var dv2 = new Int8Array(h2);
        for (var i = 0 ; i != h1.byteLength ; i++)
        {
            if (dv1[i] != dv2[i]) return false;
        }
        return true;
    }

    function cloneHasher(h) {
        const ph = h.getPartialHash();
        const res = blake2bWasm(64);
        res.setPartialHash(ph);
        return res;
    }

    async function sameRatio(curve, g1s, g1sx, g2s, g2sx) {
        if (curve.G1.isZero(g1s)) return false;
        if (curve.G1.isZero(g1sx)) return false;
        if (curve.G2.isZero(g2s)) return false;
        if (curve.G2.isZero(g2sx)) return false;
        // return curve.F12.eq(curve.pairing(g1s, g2sx), curve.pairing(g1sx, g2s));
        const res = await curve.pairingEq(g1s, g2sx, curve.G1.neg(g1sx), g2s);
        return res;
    }


    function askEntropy() {
        {
            return window.prompt("Enter a random text. (Entropy): ", "");
        }
    }

    async function getRandomRng(entropy) {
        // Generate a random Rng
        while (!entropy) {
            entropy = await askEntropy();
        }
        const hasher = blake2bWasm(64);
        hasher.update(crypto.randomBytes(64));
        const enc = new TextEncoder(); // always utf-8
        hasher.update(enc.encode(entropy));
        const hash = Buffer.from(hasher.digest());

        const seed = [];
        for (let i=0;i<8;i++) {
            seed[i] = hash.readUInt32BE(i*4);
        }
        const rng = new ChaCha(seed);
        return rng;
    }

    function rngFromBeaconParams(beaconHash, numIterationsExp) {
        let nIterationsInner;
        let nIterationsOuter;
        if (numIterationsExp<32) {
            nIterationsInner = (1 << numIterationsExp) >>> 0;
            nIterationsOuter = 1;
        } else {
            nIterationsInner = 0x100000000;
            nIterationsOuter = (1 << (numIterationsExp-32)) >>> 0;
        }

        let curHash = beaconHash;
        for (let i=0; i<nIterationsOuter; i++) {
            for (let j=0; j<nIterationsInner; j++) {
                curHash = crypto.createHash("sha256").update(curHash).digest();
            }
        }

        const curHashV = new DataView(curHash.buffer, curHash.byteOffset, curHash.byteLength);
        const seed = [];
        for (let i=0; i<8; i++) {
            seed[i] = curHashV.getUint32(i*4, false);
        }

        const rng = new ChaCha(seed);

        return rng;
    }

    function hex2ByteArray(s) {
        if (s instanceof Uint8Array) return s;
        if (s.slice(0,2) == "0x") s= s.slice(2);
        return new Uint8Array(s.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16);
        }));
    }

    function byteArray2hex(byteArray) {
        return Array.prototype.map.call(byteArray, function(byte) {
            return ("0" + (byte & 0xFF).toString(16)).slice(-2);
        }).join("");
    }

    async function writeHeader(fd, zkey) {

        // Write the header
        ///////////
        await startWriteSection(fd, 1);
        await fd.writeULE32(1); // Groth
        await endWriteSection(fd);

        // Write the Groth header section
        ///////////

        const curve = await getCurveFromQ(zkey.q);

        await startWriteSection(fd, 2);
        const primeQ = curve.q;
        const n8q = (Math.floor( (Scalar$1.bitLength(primeQ) - 1) / 64) +1)*8;

        const primeR = curve.r;
        const n8r = (Math.floor( (Scalar$1.bitLength(primeR) - 1) / 64) +1)*8;

        await fd.writeULE32(n8q);
        await writeBigInt(fd, primeQ, n8q);
        await fd.writeULE32(n8r);
        await writeBigInt(fd, primeR, n8r);
        await fd.writeULE32(zkey.nVars);                         // Total number of bars
        await fd.writeULE32(zkey.nPublic);                       // Total number of public vars (not including ONE)
        await fd.writeULE32(zkey.domainSize);                  // domainSize
        await writeG1(fd, curve, zkey.vk_alpha_1);
        await writeG1(fd, curve, zkey.vk_beta_1);
        await writeG2(fd, curve, zkey.vk_beta_2);
        await writeG2(fd, curve, zkey.vk_gamma_2);
        await writeG1(fd, curve, zkey.vk_delta_1);
        await writeG2(fd, curve, zkey.vk_delta_2);

        await endWriteSection(fd);


    }

    async function writeG1(fd, curve, p) {
        const buff = new Uint8Array(curve.G1.F.n8*2);
        curve.G1.toRprLEM(buff, 0, p);
        await fd.write(buff);
    }

    async function writeG2(fd, curve, p) {
        const buff = new Uint8Array(curve.G2.F.n8*2);
        curve.G2.toRprLEM(buff, 0, p);
        await fd.write(buff);
    }

    async function readG1(fd, curve, toObject) {
        const buff = await fd.read(curve.G1.F.n8*2);
        const res = curve.G1.fromRprLEM(buff, 0);
        return toObject ? curve.G1.toObject(res) : res;
    }

    async function readG2(fd, curve, toObject) {
        const buff = await fd.read(curve.G2.F.n8*2);
        const res = curve.G2.fromRprLEM(buff, 0);
        return toObject ? curve.G2.toObject(res) : res;
    }



    async function readHeader(fd, sections, protocol, toObject) {
        if (protocol != "groth16") throw new Error("Protocol not supported: "+protocol);

        const zkey = {};

        // Read Header
        /////////////////////
        await startReadUniqueSection(fd, sections, 1);
        const protocolId = await fd.readULE32();
        if (protocolId != 1) throw new Error("File is not groth");
        zkey.protocol = "groth16";
        await endReadSection(fd);

        // Read Groth Header
        /////////////////////
        await startReadUniqueSection(fd, sections, 2);
        const n8q = await fd.readULE32();
        zkey.n8q = n8q;
        zkey.q = await readBigInt(fd, n8q);

        const n8r = await fd.readULE32();
        zkey.n8r = n8r;
        zkey.r = await readBigInt(fd, n8r);

        let curve = await getCurveFromQ(zkey.q);

        zkey.nVars = await fd.readULE32();
        zkey.nPublic = await fd.readULE32();
        zkey.domainSize = await fd.readULE32();
        zkey.power = log2$1(zkey.domainSize);
        zkey.vk_alpha_1 = await readG1(fd, curve, toObject);
        zkey.vk_beta_1 = await readG1(fd, curve, toObject);
        zkey.vk_beta_2 = await readG2(fd, curve, toObject);
        zkey.vk_gamma_2 = await readG2(fd, curve, toObject);
        zkey.vk_delta_1 = await readG1(fd, curve, toObject);
        zkey.vk_delta_2 = await readG2(fd, curve, toObject);
        await endReadSection(fd);

        return zkey;

    }

    async function readZKey(fileName, toObject) {
        const {fd, sections} = await readBinFile(fileName, "zkey", 1);

        const zkey = await readHeader(fd, sections, "groth16", toObject);

        const Fr = new F1Field(zkey.r);
        const Rr = Scalar$1.mod(Scalar$1.shl(1, zkey.n8r*8), zkey.r);
        const Rri = Fr.inv(Rr);
        const Rri2 = Fr.mul(Rri, Rri);

        let curve = await getCurveFromQ(zkey.q);

        // Read IC Section
        ///////////
        await startReadUniqueSection(fd, sections, 3);
        zkey.IC = [];
        for (let i=0; i<= zkey.nPublic; i++) {
            const P = await readG1(fd, curve, toObject);
            zkey.IC.push(P);
        }
        await endReadSection(fd);


        // Read Coefs
        ///////////
        await startReadUniqueSection(fd, sections, 4);
        const nCCoefs = await fd.readULE32();
        zkey.ccoefs = [];
        for (let i=0; i<nCCoefs; i++) {
            const m = await fd.readULE32();
            const c = await fd.readULE32();
            const s = await fd.readULE32();
            const v = await readFr2();
            zkey.ccoefs.push({
                matrix: m,
                constraint: c,
                signal: s,
                value: v
            });
        }
        await endReadSection(fd);

        // Read A points
        ///////////
        await startReadUniqueSection(fd, sections, 5);
        zkey.A = [];
        for (let i=0; i<zkey.nVars; i++) {
            const A = await readG1(fd, curve, toObject);
            zkey.A[i] = A;
        }
        await endReadSection(fd);


        // Read B1
        ///////////
        await startReadUniqueSection(fd, sections, 6);
        zkey.B1 = [];
        for (let i=0; i<zkey.nVars; i++) {
            const B1 = await readG1(fd, curve, toObject);

            zkey.B1[i] = B1;
        }
        await endReadSection(fd);


        // Read B2 points
        ///////////
        await startReadUniqueSection(fd, sections, 7);
        zkey.B2 = [];
        for (let i=0; i<zkey.nVars; i++) {
            const B2 = await readG2(fd, curve, toObject);
            zkey.B2[i] = B2;
        }
        await endReadSection(fd);


        // Read C points
        ///////////
        await startReadUniqueSection(fd, sections, 8);
        zkey.C = [];
        for (let i=zkey.nPublic+1; i<zkey.nVars; i++) {
            const C = await readG1(fd, curve, toObject);

            zkey.C[i] = C;
        }
        await endReadSection(fd);


        // Read H points
        ///////////
        await startReadUniqueSection(fd, sections, 9);
        zkey.hExps = [];
        for (let i=0; i<zkey.domainSize; i++) {
            const H = await readG1(fd, curve, toObject);
            zkey.hExps.push(H);
        }
        await endReadSection(fd);

        await fd.close();

        return zkey;

        async function readFr2(toObject) {
            const n = await readBigInt(fd, zkey.n8r);
            return Fr.mul(n, Rri2);
        }

    }


    async function readContribution(fd, curve, toObject) {
        const c = {delta:{}};
        c.deltaAfter = await readG1(fd, curve, toObject);
        c.delta.g1_s = await readG1(fd, curve, toObject);
        c.delta.g1_sx = await readG1(fd, curve, toObject);
        c.delta.g2_spx = await readG2(fd, curve, toObject);
        c.transcript = await fd.read(64);
        c.type = await fd.readULE32();

        const paramLength = await fd.readULE32();
        const curPos = fd.pos;
        let lastType =0;
        while (fd.pos-curPos < paramLength) {
            const buffType = await fd.read(1);
            if (buffType[0]<= lastType) throw new Error("Parameters in the contribution must be sorted");
            lastType = buffType[0];
            if (buffType[0]==1) {     // Name
                const buffLen = await fd.read(1);
                const buffStr = await fd.read(buffLen[0]);
                c.name = new TextDecoder().decode(buffStr);
            } else if (buffType[0]==2) {
                const buffExp = await fd.read(1);
                c.numIterationsExp = buffExp[0];
            } else if (buffType[0]==3) {
                const buffLen = await fd.read(1);
                c.beaconHash = await fd.read(buffLen[0]);
            } else {
                throw new Error("Parameter not recognized");
            }
        }
        if (fd.pos != curPos + paramLength) {
            throw new Error("Parametes do not match");
        }

        return c;
    }


    async function readMPCParams(fd, curve, sections) {
        await startReadUniqueSection(fd, sections, 10);
        const res = { contributions: []};
        res.csHash = await fd.read(64);
        const n = await fd.readULE32();
        for (let i=0; i<n; i++) {
            const c = await readContribution(fd, curve);
            res.contributions.push(c);
        }
        await endReadSection(fd);

        return res;
    }

    async function writeContribution(fd, curve, c) {
        await writeG1(fd, curve, c.deltaAfter);
        await writeG1(fd, curve, c.delta.g1_s);
        await writeG1(fd, curve, c.delta.g1_sx);
        await writeG2(fd, curve, c.delta.g2_spx);
        await fd.write(c.transcript);
        await fd.writeULE32(c.type || 0);

        const params = [];
        if (c.name) {
            params.push(1);      // Param Name
            const nameData = new TextEncoder("utf-8").encode(c.name.substring(0,64));
            params.push(nameData.byteLength);
            for (let i=0; i<nameData.byteLength; i++) params.push(nameData[i]);
        }
        if (c.type == 1) {
            params.push(2);      // Param numIterationsExp
            params.push(c.numIterationsExp);

            params.push(3);      // Beacon Hash
            params.push(c.beaconHash.byteLength);
            for (let i=0; i<c.beaconHash.byteLength; i++) params.push(c.beaconHash[i]);
        }
        if (params.length>0) {
            const paramsBuff = new Uint8Array(params);
            await fd.writeULE32(paramsBuff.byteLength);
            await fd.write(paramsBuff);
        } else {
            await fd.writeULE32(0);
        }

    }

    async function writeMPCParams(fd, curve, mpcParams) {
        await startWriteSection(fd, 10);
        await fd.write(mpcParams.csHash);
        await fd.writeULE32(mpcParams.contributions.length);
        for (let i=0; i<mpcParams.contributions.length; i++) {
            await writeContribution(fd, curve,mpcParams.contributions[i]);
        }
        await endWriteSection(fd);
    }

    function hashG1(hasher, curve, p) {
        const buff = new Uint8Array(curve.G1.F.n8*2);
        curve.G1.toRprUncompressed(buff, 0, p);
        hasher.update(buff);
    }

    function hashG2(hasher,curve, p) {
        const buff = new Uint8Array(curve.G2.F.n8*2);
        curve.G2.toRprUncompressed(buff, 0, p);
        hasher.update(buff);
    }

    function hashPubKey(hasher, curve, c) {
        hashG1(hasher, curve, c.deltaAfter);
        hashG1(hasher, curve, c.delta.g1_s);
        hashG1(hasher, curve, c.delta.g1_sx);
        hashG2(hasher, curve, c.delta.g2_spx);
        hasher.update(c.transcript);
    }

    async function write(fd, witness, prime) {

        await startWriteSection(fd, 1);
        const n8 = (Math.floor( (Scalar$1.bitLength(prime) - 1) / 64) +1)*8;
        await fd.writeULE32(n8);
        await writeBigInt(fd, prime, n8);
        await fd.writeULE32(witness.length);
        await endWriteSection(fd);

        await startWriteSection(fd, 2);
        for (let i=0; i<witness.length; i++) {
            await writeBigInt(fd, witness[i], n8);
        }
        await endWriteSection(fd);


    }

    async function writeBin(fd, witnessBin, prime) {

        await startWriteSection(fd, 1);
        const n8 = (Math.floor( (Scalar$1.bitLength(prime) - 1) / 64) +1)*8;
        await fd.writeULE32(n8);
        await writeBigInt(fd, prime, n8);
        if (witnessBin.byteLength % n8 != 0) {
            throw new Error("Invalid witness length");
        }
        await fd.writeULE32(witnessBin.byteLength / n8);
        await endWriteSection(fd);


        await startWriteSection(fd, 2);
        await fd.write(witnessBin);
        await endWriteSection(fd);

    }

    async function readHeader$1(fd, sections) {

        await startReadUniqueSection(fd, sections, 1);
        const n8 = await fd.readULE32();
        const q = await readBigInt(fd, n8);
        const nWitness = await fd.readULE32();
        await endReadSection(fd);

        return {n8, q, nWitness};

    }

    async function read(fileName) {

        const {fd, sections} = await readBinFile(fileName, "wtns", 2);

        const {n8, nWitness} = await readHeader$1(fd, sections);

        await startReadUniqueSection(fd, sections, 2);
        const res = [];
        for (let i=0; i<nWitness; i++) {
            const v = await readBigInt(fd, n8);
            res.push(v);
        }
        await endReadSection(fd);

        await fd.close();

        return res;
    }

    const {stringifyBigInts: stringifyBigInts$3} = utils$1;

    async function groth16Prove(zkeyFileName, witnessFileName, logger) {
        const {fd: fdWtns, sections: sectionsWtns} = await readBinFile(witnessFileName, "wtns", 2);

        const wtns = await readHeader$1(fdWtns, sectionsWtns);

        const {fd: fdZKey, sections: sectionsZKey} = await readBinFile(zkeyFileName, "zkey", 2);

        const zkey = await readHeader(fdZKey, sectionsZKey, "groth16");

        if (!Scalar$1.eq(zkey.r,  wtns.q)) {
            throw new Error("Curve of the witness does not match the curve of the proving key");
        }

        if (wtns.nWitness != zkey.nVars) {
            throw new Error(`Invalid witness length. Circuit: ${zkey.nVars}, witness: ${wtns.nWitness}`);
        }

        const curve = await getCurveFromQ(zkey.q);
        const Fr = curve.Fr;
        const G1 = curve.G1;
        const G2 = curve.G2;

        const power = log2$1(zkey.domainSize);

        if (logger) logger.debug("Reading Wtns");
        const buffWitness = await readSection(fdWtns, sectionsWtns, 2);
        if (logger) logger.debug("Reading Coeffs");
        const buffCoeffs = await readSection(fdZKey, sectionsZKey, 4);

        if (logger) logger.debug("Building ABC");
        const [buffA_T, buffB_T, buffC_T] = await buldABC1(curve, zkey, buffWitness, buffCoeffs, logger);

        const inc = power == Fr.s ? curve.Fr.shift : curve.Fr.w[power+1];

        const buffA = await Fr.ifft(buffA_T, "", "", logger, "IFFT_A");
        const buffAodd = await Fr.batchApplyKey(buffA, Fr.e(1), inc);
        const buffAodd_T = await Fr.fft(buffAodd, "", "", logger, "FFT_A");

        const buffB = await Fr.ifft(buffB_T, "", "", logger, "IFFT_B");
        const buffBodd = await Fr.batchApplyKey(buffB, Fr.e(1), inc);
        const buffBodd_T = await Fr.fft(buffBodd, "", "", logger, "FFT_B");

        const buffC = await Fr.ifft(buffC_T, "", "", logger, "IFFT_C");
        const buffCodd = await Fr.batchApplyKey(buffC, Fr.e(1), inc);
        const buffCodd_T = await Fr.fft(buffCodd, "", "", logger, "FFT_C");

        if (logger) logger.debug("Join ABC");
        const buffPodd_T = await joinABC(curve, zkey, buffAodd_T, buffBodd_T, buffCodd_T, logger);

        let proof = {};

        if (logger) logger.debug("Reading A Points");
        const buffBasesA = await readSection(fdZKey, sectionsZKey, 5);
        proof.pi_a = await curve.G1.multiExpAffine(buffBasesA, buffWitness, logger, "multiexp A");

        if (logger) logger.debug("Reading B1 Points");
        const buffBasesB1 = await readSection(fdZKey, sectionsZKey, 6);
        let pib1 = await curve.G1.multiExpAffine(buffBasesB1, buffWitness, logger, "multiexp B1");

        if (logger) logger.debug("Reading B2 Points");
        const buffBasesB2 = await readSection(fdZKey, sectionsZKey, 7);
        proof.pi_b = await curve.G2.multiExpAffine(buffBasesB2, buffWitness, logger, "multiexp B2");

        if (logger) logger.debug("Reading C Points");
        const buffBasesC = await readSection(fdZKey, sectionsZKey, 8);
        proof.pi_c = await curve.G1.multiExpAffine(buffBasesC, buffWitness.slice((zkey.nPublic+1)*curve.Fr.n8), logger, "multiexp C");

        if (logger) logger.debug("Reading H Points");
        const buffBasesH = await readSection(fdZKey, sectionsZKey, 9);
        const resH = await curve.G1.multiExpAffine(buffBasesH, buffPodd_T, logger, "multiexp H");

        const r = curve.Fr.random();
        const s = curve.Fr.random();

        proof.pi_a  = G1.add( proof.pi_a, zkey.vk_alpha_1 );
        proof.pi_a  = G1.add( proof.pi_a, G1.timesFr( zkey.vk_delta_1, r ));

        proof.pi_b  = G2.add( proof.pi_b, zkey.vk_beta_2 );
        proof.pi_b  = G2.add( proof.pi_b, G2.timesFr( zkey.vk_delta_2, s ));

        pib1 = G1.add( pib1, zkey.vk_beta_1 );
        pib1 = G1.add( pib1, G1.timesFr( zkey.vk_delta_1, s ));

        proof.pi_c = G1.add(proof.pi_c, resH);


        proof.pi_c  = G1.add( proof.pi_c, G1.timesFr( proof.pi_a, s ));
        proof.pi_c  = G1.add( proof.pi_c, G1.timesFr( pib1, r ));
        proof.pi_c  = G1.add( proof.pi_c, G1.timesFr( zkey.vk_delta_1, Fr.neg(Fr.mul(r,s) )));


        let publicSignals = [];

        for (let i=1; i<= zkey.nPublic; i++) {
            const b = buffWitness.slice(i*Fr.n8, i*Fr.n8+Fr.n8);
            publicSignals.push(Scalar$1.fromRprLE(b));
        }

        proof.pi_a = G1.toObject(G1.toAffine(proof.pi_a));
        proof.pi_b = G2.toObject(G2.toAffine(proof.pi_b));
        proof.pi_c = G1.toObject(G1.toAffine(proof.pi_c));

        proof.protocol = "groth16";

        await fdZKey.close();
        await fdWtns.close();

        proof = stringifyBigInts$3(proof);
        publicSignals = stringifyBigInts$3(publicSignals);

        return {proof, publicSignals};
    }


    async function buldABC1(curve, zkey, witness, coeffs, logger) {
        const n8 = curve.Fr.n8;
        const sCoef = 4*3 + zkey.n8r;
        const nCoef = (coeffs.byteLength-4) / sCoef;

        const outBuffA = new BigBuffer(zkey.domainSize * n8);
        const outBuffB = new BigBuffer(zkey.domainSize * n8);
        const outBuffC = new BigBuffer(zkey.domainSize * n8);

        const outBuf = [ outBuffA, outBuffB ];
        for (let i=0; i<nCoef; i++) {
            if ((logger)&&(i%1000000 == 0)) logger.debug(`QAP AB: ${i}/${nCoef}`);
            const buffCoef = coeffs.slice(4+i*sCoef, 4+i*sCoef+sCoef);
            const buffCoefV = new DataView(buffCoef.buffer);
            const m= buffCoefV.getUint32(0, true);
            const c= buffCoefV.getUint32(4, true);
            const s= buffCoefV.getUint32(8, true);
            const coef = buffCoef.slice(12, 12+n8);
            outBuf[m].set(
                curve.Fr.add(
                    outBuf[m].slice(c*n8, c*n8+n8),
                    curve.Fr.mul(coef, witness.slice(s*n8, s*n8+n8))
                ),
                c*n8
            );
        }

        for (let i=0; i<zkey.domainSize; i++) {
            if ((logger)&&(i%1000000 == 0)) logger.debug(`QAP C: ${i}/${zkey.domainSize}`);
            outBuffC.set(
                curve.Fr.mul(
                    outBuffA.slice(i*n8, i*n8+n8),
                    outBuffB.slice(i*n8, i*n8+n8),
                ),
                i*n8
            );
        }

        return [outBuffA, outBuffB, outBuffC];

    }


    async function joinABC(curve, zkey, a, b, c, logger) {
        const MAX_CHUNK_SIZE = 1 << 22;

        const n8 = curve.Fr.n8;
        const nElements = Math.floor(a.byteLength / curve.Fr.n8);

        const promises = [];

        for (let i=0; i<nElements; i += MAX_CHUNK_SIZE) {
            if (logger) logger.debug(`JoinABC: ${i}/${nElements}`);
            const n= Math.min(nElements - i, MAX_CHUNK_SIZE);

            const task = [];

            const aChunk = a.slice(i*n8, (i + n)*n8 );
            const bChunk = b.slice(i*n8, (i + n)*n8 );
            const cChunk = c.slice(i*n8, (i + n)*n8 );

            task.push({cmd: "ALLOCSET", var: 0, buff: aChunk});
            task.push({cmd: "ALLOCSET", var: 1, buff: bChunk});
            task.push({cmd: "ALLOCSET", var: 2, buff: cChunk});
            task.push({cmd: "ALLOC", var: 3, len: n*n8});
            task.push({cmd: "CALL", fnName: "qap_joinABC", params:[
                {var: 0},
                {var: 1},
                {var: 2},
                {val: n},
                {var: 3},
            ]});
            task.push({cmd: "CALL", fnName: "frm_batchFromMontgomery", params:[
                {var: 3},
                {val: n},
                {var: 3}
            ]});
            task.push({cmd: "GET", out: 0, var: 3, len: n*n8});
            promises.push(curve.tm.queueAction(task));
        }

        const result = await Promise.all(promises);

        let outBuff;
        if (a instanceof BigBuffer) {
            outBuff = new BigBuffer(a.byteLength);
        } else {
            outBuff = new Uint8Array(a.byteLength);
        }

        let p=0;
        for (let i=0; i<result.length; i++) {
            outBuff.set(result[i][0], p);
            p += result[i][0].byteLength;
        }

        return outBuff;
    }

    /**
     * FNV-1a Hash implementation (32, 64, 128, 256, 512, and 1024 bit)
     * @author Travis Webb <me@traviswebb.com>
     * @see http://tools.ietf.org/html/draft-eastlake-fnv-06
     */

    var fnvPlus = createCommonjsModule(function (module) {
    var fnvplus = (function(){
    	var i, hl = [], hl16 = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'],
    		version = '1a',
    		useUTF8 = false,
    		_hash32, _hash52, _hash64, _hash128, _hash256, _hash512, _hash1024,
    		referenceSeed = 'chongo <Landon Curt Noll> /\\../\\',
    		defaultKeyspace = 52,
    		fnvConstants = {
    			32: {offset: 0},
    			64: {offset: [0,0,0,0]},
    			128: {offset: [0,0,0,0,0,0,0,0]},
    			256: {offset: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
    			512: {offset: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},
    			1024: {offset: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}};

    	for(i=0; i < 256; i++){
    		hl[i] = ((i >> 4) & 15).toString(16) + (i & 15).toString(16);
    	}

    	function hexToBase(hex, base){
    		var alphabet = '0123456789abcdefghijklmnopqrstuvwxyz',
    			digits = [0], carry, i, j, string = '';

    		for(i = 0; i < hex.length; i+=2){
    			carry = parseInt(hex.substr(i,2),16);
    			for(j = 0; j < digits.length; j++){
    				carry += digits[j] << 8;
    				digits[j] = carry % base;
    				carry = (carry / base) | 0;
    			}
    			while (carry > 0) {
    				digits.push(carry % base);
    				carry = (carry / base) | 0;
    			}
    		}

    		for (i = digits.length - 1; i >= 0; --i){
    			string += alphabet[digits[i]];
    		}

    		return string;
    	}

    	function hashValHex(value, keyspace) {
    		return {
    			bits: keyspace,
    			value: value,
    			dec: function(){return hexToBase(value, 10);},
    			hex: function(){return value;},
    			str: function(){return hexToBase(value, 36);}
    		};
    	}

    	function hashValInt32(value, keyspace) {
    		return {
    			bits: keyspace,
    			value: value,
    			dec: function(){return value.toString();},
    			hex: function(){return hl[value>>>24]+ hl[(value>>>16)&255]+hl[(value>>>8)&255]+hl[value&255];},
    			str: function(){return value.toString(36);}
    		};
    	}

    	function hashValInt52(value, keyspace) {
    		return {
    			bits: keyspace,
    			value: value,
    			dec: function(){return value.toString();},
    			hex: function(){return ('0000000000000000'+value.toString(16)).substr(-13);},
    			str: function(){return value.toString(36);}
    		};
    	}

    	function hash(message, keyspace) {
    		var str = (typeof message === 'object') ? JSON.stringify(message) : message;

    		switch(keyspace || defaultKeyspace){
    			case 32:
    				return _hash32(str);
    			case 64:
    				return _hash64(str);
    			case 128:
    				return _hash128(str);
    			case 256:
    				return _hash256(str);
    			case 512:
    				return _hash512(str);
    			case 1024:
    				return _hash1024(str);
    			default:
    				return _hash52(str);
    		}
    	}

    	function setKeyspace(keyspace) {
    		if (keyspace === 52 || fnvConstants[keyspace]) {
    			defaultKeyspace = keyspace;
    		} else {
    			throw new Error('Supported FNV keyspacs: 32, 52, 64, 128, 256, 512, and 1024 bit');
    		}
    	}

    	function setVersion(_version) {
    		if (_version === '1a' ) {
    			version = _version;
    			_hash32   = useUTF8 ? _hash32_1a_utf   : _hash32_1a;
    			_hash52   = useUTF8 ? _hash52_1a_utf   : _hash52_1a;
    			_hash64   = useUTF8 ? _hash64_1a_utf   : _hash64_1a;
    			_hash128  = useUTF8 ? _hash128_1a_utf  : _hash128_1a;
    			_hash256  = useUTF8 ? _hash256_1a_utf  : _hash256_1a;
    			_hash512  = useUTF8 ? _hash512_1a_utf  : _hash512_1a;
    			_hash1024 = useUTF8 ? _hash1024_1a_utf : _hash1024_1a;
    		} else if (_version === '1') {
    			version = _version;
    			_hash32   = useUTF8 ? _hash32_1_utf   : _hash32_1;
    			_hash52   = useUTF8 ? _hash52_1_utf   : _hash52_1;
    			_hash64   = useUTF8 ? _hash64_1_utf   : _hash64_1;
    			_hash128  = useUTF8 ? _hash128_1_utf  : _hash128_1;
    			_hash256  = useUTF8 ? _hash256_1_utf  : _hash256_1;
    			_hash512  = useUTF8 ? _hash512_1_utf  : _hash512_1;
    			_hash1024 = useUTF8 ? _hash1024_1_utf : _hash1024_1;
    		} else {
    			throw new Error('Supported FNV versions: 1, 1a');
    		}
    	}

    	function setUTF8(utf8) {
    		if (utf8) {
    			useUTF8 = true;
    			_hash32   = version == '1a' ? _hash32_1a_utf   : _hash32_1_utf;
    			_hash52   = version == '1a' ? _hash52_1a_utf   : _hash52_1_utf;
    			_hash64   = version == '1a' ? _hash64_1a_utf   : _hash64_1_utf;
    			_hash128  = version == '1a' ? _hash128_1a_utf  : _hash128_1_utf;
    			_hash256  = version == '1a' ? _hash256_1a_utf  : _hash256_1_utf;
    			_hash512  = version == '1a' ? _hash512_1a_utf  : _hash512_1_utf;
    			_hash1024 = version == '1a' ? _hash1024_1a_utf : _hash1024_1_utf;
    		} else {
    			useUTF8 = false;
    			_hash32   = version == '1a' ? _hash32_1a   : _hash32_1;
    			_hash52   = version == '1a' ? _hash52_1a   : _hash52_1;
    			_hash64   = version == '1a' ? _hash64_1a   : _hash64_1;
    			_hash128  = version == '1a' ? _hash128_1a  : _hash128_1;
    			_hash256  = version == '1a' ? _hash256_1a  : _hash256_1;
    			_hash512  = version == '1a' ? _hash512_1a  : _hash512_1;
    			_hash1024 = version == '1a' ? _hash1024_1a : _hash1024_1;
    		}
    	}

    	function seed(seed) {
    		var oldVersion = version, res, i;

    		seed = (seed || seed === 0) ? seed : referenceSeed;

    		if (seed === referenceSeed) setVersion('1');

    		for (var keysize in fnvConstants) {
    			fnvConstants[keysize].offset = [];
    			for(i = 0; i < keysize / 16; i++){
    				fnvConstants[keysize].offset[i]	= 0;
    			}
    			res = hash(seed, parseInt(keysize, 10)).hex();
    			for(i = 0; i < keysize / 16; i++){
    				fnvConstants[keysize].offset[i]	= parseInt(res.substr(i*4,4), 16);
    			}
    		}

    		setVersion(oldVersion);
    	}

    	/**
    	 * Implementation without library overhead.
    	 */

    	function _hash32_1a_fast(str) {
    		var i, l = str.length-3, t0=0,v0=0x9dc5,t1=0,v1=0x811c;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}


    		return ((v1<<16)>>>0)+v0;
    	}

    	function _hash32_1a_fast_hex(str) {
    		var i, l = str.length-3, t0=0,v0=0x9dc5,t1=0,v1=0x811c;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}


    		return hl[(v1>>>8)&255]+hl[v1&255]+hl[(v0>>>8)&255]+hl[v0&255];
    	}

    	function _hash52_1a_fast(str){
    		var i,l=str.length-3,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return (v3&15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0^(v3>>4));
    	}

    	function _hash52_1a_fast_hex(str){
    		var i,l=str.length-3,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return hl16[v3&15]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[(v0>>8)^(v3>>12)]+hl[(v0^(v3>>4))&255];
    	}

    	function _hash64_1a_fast(str){
    		var i,l=str.length-3,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255];
    	}

    	function _hash32_1a_fast_utf(str) {
    		var c,i,l=str.length,t0=0,v0=0x9dc5,t1=0,v1=0x811c;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}

    		return ((v1<<16)>>>0)+v0;
    	}

    	function _hash32_1a_fast_hex_utf(str) {
    		var c,i,l=str.length,t0=0,v0=0x9dc5,t1=0,v1=0x811c;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}


    		return hl[(v1>>>8)&255]+hl[v1&255]+hl[(v0>>>8)&255]+hl[v0&255];
    	}

    	function _hash52_1a_fast_utf(str){
    		var c,i,l=str.length,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return (v3&15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0^(v3>>4));
    	}

    	function _hash52_1a_fast_hex_utf (str){
    		var c,i,l=str.length,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return hl16[v3&15]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[(v0>>8)^(v3>>12)]+hl[(v0^(v3>>4))&255];
    	}

    	function _hash64_1a_fast_utf(str){
    		var c,i,l=str.length,t0=0,v0=0x2325,t1=0,v1=0x8422,t2=0,v2=0x9ce4,t3=0,v3=0xcbf2;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255];
    	}
    	/**
    	 * Regular functions. This versions are accessible through API
    	 */

    	function _hash32_1a(str){
    		var i,l=str.length-3,s=fnvConstants[32].offset,t0=0,v0=s[1]|0,t1=0,v1=s[0]|0;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}

    		return hashValInt32(((v1<<16)>>>0)+v0,32);
    	}

    	function _hash32_1(str){
    		var i,l=str.length-3,s=fnvConstants[32].offset,t0=0,v0=s[1]|0,t1=0,v1=s[0]|0;

    		for (i = 0; i < l;) {
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		while(i<l+3){
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		return hashValInt32(((v1<<16)>>>0)+v0,32);
    	}

    	function _hash32_1a_utf(str){
    		var c,i,l=str.length,s=fnvConstants[32].offset,t0=0,v0=s[1]|0,t1=0,v1=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    		}

    		return hashValInt32(((v1<<16)>>>0)+v0,32);
    	}

    	function _hash32_1_utf(str){
    		var c,i,l=str.length,s=fnvConstants[32].offset,t0=0,v0=s[1]|0,t1=0,v1=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			t0=v0*403;t1=v1*403;
    			t1+=v0<<8;
    			v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*403;t1=v1*403;
    				t1+=v0<<8;
    				v1=(t1+(t0>>>16))&65535;v0=t0&65535;
    				v0^=(c&63)|128;
    			}
    		}

    		return hashValInt32(((v1<<16)>>>0)+v0,32);
    	}

    	_hash32 = _hash32_1a;

    	function _hash52_1a(str){
    		var i,l=str.length-3,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return hashValInt52((v3&15)*281474976710656+v2*4294967296+v1*65536+(v0^(v3>>4)),52);
    	}

    	function _hash52_1(str){
    		var i,l=str.length-3,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

    		for (i = 0; i < l;) {
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		while(i<l+3){
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		return hashValInt52((v3&15)*281474976710656+v2*4294967296+v1*65536+(v0^(v3>>4)),52);
    	}

    	function _hash52_1a_utf(str){
    		var c,i,l=str.length,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return hashValInt52((v3&15)*281474976710656+v2*4294967296+v1*65536+(v0^(v3>>4)),52);
    	}

    	function _hash52_1_utf(str){
    		var c,i,l=str.length,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}
    		}

    		return hashValInt52((v3&15)*281474976710656+v2*4294967296+v1*65536+(v0^(v3>>4)),52);
    	}

    	_hash52 = _hash52_1a;

    	function _hash64_1a(str){
    		var i,l=str.length-3,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return hashValHex(hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],64);
    	}

    	function _hash64_1(str){
    		var i,l=str.length-3,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

    		for (i = 0; i < l;) {
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		while(i<l+3){
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		return hashValHex(hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],64);
    	}

    	function _hash64_1a_utf(str){
    		var c,i,l=str.length,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    		}

    		return hashValHex(hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],64);
    	}

    	function _hash64_1_utf(str){
    		var c,i,l=str.length,s=fnvConstants[64].offset,t0=0,v0=s[3]|0,t1=0,v1=s[2]|0,t2=0,v2=s[1]|0,t3=0,v3=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    			t2+=v0<<8;t3+=v1<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*435;t1=v1*435;t2=v2*435;t3=v3*435;
    				t2+=v0<<8;t3+=v1<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;v3=(t3+(t2>>>16))&65535;v2=t2&65535;
    				v0^=(c&63)|128;
    			}
    		}

    		return hashValHex(hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],64);
    	}

    	_hash64 = _hash64_1a;

    	function _hash128_1a(str){
    		var i,l=str.length-3,s=fnvConstants[128].offset,t0=0,v0=s[7]|0,t1=0,v1=s[6]|0,t2=0,v2=s[5]|0,t3=0,v3=s[4]|0,t4=0,v4=s[3]|0,t5=0,v5=s[2]|0,t6=0,v6=s[1]|0,t7=0,v7=s[0]|0;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    		}

    		return hashValHex(hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],128);
    	}

    	function _hash128_1(str){
    		var i,l=str.length-3,s=fnvConstants[128].offset,t0=0,v0=s[7]|0,t1=0,v1=s[6]|0,t2=0,v2=s[5]|0,t3=0,v3=s[4]|0,t4=0,v4=s[3]|0,t5=0,v5=s[2]|0,t6=0,v6=s[1]|0,t7=0,v7=s[0]|0;

    		for (i = 0; i < l;) {
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		while(i<l+3){
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		return hashValHex(hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],128);
    	}

    	function _hash128_1a_utf(str){
    		var c,i,l=str.length,s=fnvConstants[128].offset,t0=0,v0=s[7]|0,t1=0,v1=s[6]|0,t2=0,v2=s[5]|0,t3=0,v3=s[4]|0,t4=0,v4=s[3]|0,t5=0,v5=s[2]|0,t6=0,v6=s[1]|0,t7=0,v7=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    		}

    		return hashValHex(hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],128);
    	}

    	function _hash128_1_utf(str){
    		var c,i,l=str.length,s=fnvConstants[128].offset,t0=0,v0=s[7]|0,t1=0,v1=s[6]|0,t2=0,v2=s[5]|0,t3=0,v3=s[4]|0,t4=0,v4=s[3]|0,t5=0,v5=s[2]|0,t6=0,v6=s[1]|0,t7=0,v7=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    			t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*315;t1=v1*315;t2=v2*315;t3=v3*315;t4=v4*315;t5=v5*315;t6=v6*315;t7=v7*315;
    				t5+=v0<<8;t6+=v1<<8;t7+=v2<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;v7=(t7+(t6>>>16))&65535;v6=t6&65535;
    				v0^=(c&63)|128;
    			}
    		}

    		return hashValHex(hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],128);
    	}

    	_hash128 = _hash128_1a;

    	function _hash256_1a(str){
    		var i,l=str.length-3,s=fnvConstants[256].offset,t0=0,v0=s[15]|0,t1=0,v1=s[14]|0,t2=0,v2=s[13]|0,t3=0,v3=s[12]|0,t4=0,v4=s[11]|0,t5=0,v5=s[10]|0,t6=0,v6=s[9]|0,t7=0,v7=s[8]|0,t8=0,v8=s[7]|0,t9=0,v9=s[6]|0,t10=0,v10=s[5]|0,t11=0,v11=s[4]|0,t12=0,v12=s[3]|0,t13=0,v13=s[2]|0,t14=0,v14=s[1]|0,t15=0,v15=s[0]|0;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    		}

    		return hashValHex(hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],256);
    	}

    	function _hash256_1(str){
    		var i,l=str.length-3,s=fnvConstants[256].offset,t0=0,v0=s[15]|0,t1=0,v1=s[14]|0,t2=0,v2=s[13]|0,t3=0,v3=s[12]|0,t4=0,v4=s[11]|0,t5=0,v5=s[10]|0,t6=0,v6=s[9]|0,t7=0,v7=s[8]|0,t8=0,v8=s[7]|0,t9=0,v9=s[6]|0,t10=0,v10=s[5]|0,t11=0,v11=s[4]|0,t12=0,v12=s[3]|0,t13=0,v13=s[2]|0,t14=0,v14=s[1]|0,t15=0,v15=s[0]|0;

    		for (i = 0; i < l;) {
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		while(i<l+3){
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		return hashValHex(hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],256);
    	}

    	function _hash256_1a_utf(str){
    		var c,i,l=str.length,s=fnvConstants[256].offset,t0=0,v0=s[15]|0,t1=0,v1=s[14]|0,t2=0,v2=s[13]|0,t3=0,v3=s[12]|0,t4=0,v4=s[11]|0,t5=0,v5=s[10]|0,t6=0,v6=s[9]|0,t7=0,v7=s[8]|0,t8=0,v8=s[7]|0,t9=0,v9=s[6]|0,t10=0,v10=s[5]|0,t11=0,v11=s[4]|0,t12=0,v12=s[3]|0,t13=0,v13=s[2]|0,t14=0,v14=s[1]|0,t15=0,v15=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    		}

    		return hashValHex(hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],256);
    	}

    	function _hash256_1_utf(str){
    		var c,i,l=str.length,s=fnvConstants[256].offset,t0=0,v0=s[15]|0,t1=0,v1=s[14]|0,t2=0,v2=s[13]|0,t3=0,v3=s[12]|0,t4=0,v4=s[11]|0,t5=0,v5=s[10]|0,t6=0,v6=s[9]|0,t7=0,v7=s[8]|0,t8=0,v8=s[7]|0,t9=0,v9=s[6]|0,t10=0,v10=s[5]|0,t11=0,v11=s[4]|0,t12=0,v12=s[3]|0,t13=0,v13=s[2]|0,t14=0,v14=s[1]|0,t15=0,v15=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    			t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*355;t1=v1*355;t2=v2*355;t3=v3*355;t4=v4*355;t5=v5*355;t6=v6*355;t7=v7*355;t8=v8*355;t9=v9*355;t10=v10*355;t11=v11*355;t12=v12*355;t13=v13*355;t14=v14*355;t15=v15*355;
    				t10+=v0<<8;t11+=v1<<8;t12+=v2<<8;t13+=v3<<8;t14+=v4<<8;t15+=v5<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;v15=(t15+(t14>>>16))&65535;v14=t14&65535;
    				v0^=(c&63)|128;
    			}
    		}

    		return hashValHex(hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],256);
    	}

    	_hash256 = _hash256_1a;

    	function _hash512_1a(str){
    		var i,l=str.length-3,s=fnvConstants[512].offset,t0=0,v0=s[31]|0,t1=0,v1=s[30]|0,t2=0,v2=s[29]|0,t3=0,v3=s[28]|0,t4=0,v4=s[27]|0,t5=0,v5=s[26]|0,t6=0,v6=s[25]|0,t7=0,v7=s[24]|0,t8=0,v8=s[23]|0,t9=0,v9=s[22]|0,t10=0,v10=s[21]|0,t11=0,v11=s[20]|0,t12=0,v12=s[19]|0,t13=0,v13=s[18]|0,t14=0,v14=s[17]|0,t15=0,v15=s[16]|0,t16=0,v16=s[15]|0,t17=0,v17=s[14]|0,t18=0,v18=s[13]|0,t19=0,v19=s[12]|0,t20=0,v20=s[11]|0,t21=0,v21=s[10]|0,t22=0,v22=s[9]|0,t23=0,v23=s[8]|0,t24=0,v24=s[7]|0,t25=0,v25=s[6]|0,t26=0,v26=s[5]|0,t27=0,v27=s[4]|0,t28=0,v28=s[3]|0,t29=0,v29=s[2]|0,t30=0,v30=s[1]|0,t31=0,v31=s[0]|0;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    		}

    		return hashValHex(hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],512);
    	}

    	function _hash512_1(str){
    		var i,l=str.length-3,s=fnvConstants[512].offset,t0=0,v0=s[31]|0,t1=0,v1=s[30]|0,t2=0,v2=s[29]|0,t3=0,v3=s[28]|0,t4=0,v4=s[27]|0,t5=0,v5=s[26]|0,t6=0,v6=s[25]|0,t7=0,v7=s[24]|0,t8=0,v8=s[23]|0,t9=0,v9=s[22]|0,t10=0,v10=s[21]|0,t11=0,v11=s[20]|0,t12=0,v12=s[19]|0,t13=0,v13=s[18]|0,t14=0,v14=s[17]|0,t15=0,v15=s[16]|0,t16=0,v16=s[15]|0,t17=0,v17=s[14]|0,t18=0,v18=s[13]|0,t19=0,v19=s[12]|0,t20=0,v20=s[11]|0,t21=0,v21=s[10]|0,t22=0,v22=s[9]|0,t23=0,v23=s[8]|0,t24=0,v24=s[7]|0,t25=0,v25=s[6]|0,t26=0,v26=s[5]|0,t27=0,v27=s[4]|0,t28=0,v28=s[3]|0,t29=0,v29=s[2]|0,t30=0,v30=s[1]|0,t31=0,v31=s[0]|0;

    		for (i = 0; i < l;) {
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		while(i<l+3){
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		return hashValHex(hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],512);
    	}

    	function _hash512_1a_utf(str){
    		var c,i,l=str.length,s=fnvConstants[512].offset,t0=0,v0=s[31]|0,t1=0,v1=s[30]|0,t2=0,v2=s[29]|0,t3=0,v3=s[28]|0,t4=0,v4=s[27]|0,t5=0,v5=s[26]|0,t6=0,v6=s[25]|0,t7=0,v7=s[24]|0,t8=0,v8=s[23]|0,t9=0,v9=s[22]|0,t10=0,v10=s[21]|0,t11=0,v11=s[20]|0,t12=0,v12=s[19]|0,t13=0,v13=s[18]|0,t14=0,v14=s[17]|0,t15=0,v15=s[16]|0,t16=0,v16=s[15]|0,t17=0,v17=s[14]|0,t18=0,v18=s[13]|0,t19=0,v19=s[12]|0,t20=0,v20=s[11]|0,t21=0,v21=s[10]|0,t22=0,v22=s[9]|0,t23=0,v23=s[8]|0,t24=0,v24=s[7]|0,t25=0,v25=s[6]|0,t26=0,v26=s[5]|0,t27=0,v27=s[4]|0,t28=0,v28=s[3]|0,t29=0,v29=s[2]|0,t30=0,v30=s[1]|0,t31=0,v31=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    		}

    		return hashValHex(hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],512);
    	}

    	function _hash512_1_utf(str){
    		var c,i,l=str.length,s=fnvConstants[512].offset,t0=0,v0=s[31]|0,t1=0,v1=s[30]|0,t2=0,v2=s[29]|0,t3=0,v3=s[28]|0,t4=0,v4=s[27]|0,t5=0,v5=s[26]|0,t6=0,v6=s[25]|0,t7=0,v7=s[24]|0,t8=0,v8=s[23]|0,t9=0,v9=s[22]|0,t10=0,v10=s[21]|0,t11=0,v11=s[20]|0,t12=0,v12=s[19]|0,t13=0,v13=s[18]|0,t14=0,v14=s[17]|0,t15=0,v15=s[16]|0,t16=0,v16=s[15]|0,t17=0,v17=s[14]|0,t18=0,v18=s[13]|0,t19=0,v19=s[12]|0,t20=0,v20=s[11]|0,t21=0,v21=s[10]|0,t22=0,v22=s[9]|0,t23=0,v23=s[8]|0,t24=0,v24=s[7]|0,t25=0,v25=s[6]|0,t26=0,v26=s[5]|0,t27=0,v27=s[4]|0,t28=0,v28=s[3]|0,t29=0,v29=s[2]|0,t30=0,v30=s[1]|0,t31=0,v31=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    			t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*343;t1=v1*343;t2=v2*343;t3=v3*343;t4=v4*343;t5=v5*343;t6=v6*343;t7=v7*343;t8=v8*343;t9=v9*343;t10=v10*343;t11=v11*343;t12=v12*343;t13=v13*343;t14=v14*343;t15=v15*343;t16=v16*343;t17=v17*343;t18=v18*343;t19=v19*343;t20=v20*343;t21=v21*343;t22=v22*343;t23=v23*343;t24=v24*343;t25=v25*343;t26=v26*343;t27=v27*343;t28=v28*343;t29=v29*343;t30=v30*343;t31=v31*343;
    				t21+=v0<<8;t22+=v1<<8;t23+=v2<<8;t24+=v3<<8;t25+=v4<<8;t26+=v5<<8;t27+=v6<<8;t28+=v7<<8;t29+=v8<<8;t30+=v9<<8;t31+=v10<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;v31=(t31+(t30>>>16))&65535;v30=t30&65535;
    				v0^=(c&63)|128;
    			}
    		}

    		return hashValHex(hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],512);
    	}

    	_hash512 = _hash512_1a;

    	function _hash1024_1a(str){
    		var i,l=str.length-3,s=fnvConstants[1024].offset,t0=0,v0=s[63]|0,t1=0,v1=s[62]|0,t2=0,v2=s[61]|0,t3=0,v3=s[60]|0,t4=0,v4=s[59]|0,t5=0,v5=s[58]|0,t6=0,v6=s[57]|0,t7=0,v7=s[56]|0,t8=0,v8=s[55]|0,t9=0,v9=s[54]|0,t10=0,v10=s[53]|0,t11=0,v11=s[52]|0,t12=0,v12=s[51]|0,t13=0,v13=s[50]|0,t14=0,v14=s[49]|0,t15=0,v15=s[48]|0,t16=0,v16=s[47]|0,t17=0,v17=s[46]|0,t18=0,v18=s[45]|0,t19=0,v19=s[44]|0,t20=0,v20=s[43]|0,t21=0,v21=s[42]|0,t22=0,v22=s[41]|0,t23=0,v23=s[40]|0,t24=0,v24=s[39]|0,t25=0,v25=s[38]|0,t26=0,v26=s[37]|0,t27=0,v27=s[36]|0,t28=0,v28=s[35]|0,t29=0,v29=s[34]|0,t30=0,v30=s[33]|0,t31=0,v31=s[32]|0,t32=0,v32=s[31]|0,t33=0,v33=s[30]|0,t34=0,v34=s[29]|0,t35=0,v35=s[28]|0,t36=0,v36=s[27]|0,t37=0,v37=s[26]|0,t38=0,v38=s[25]|0,t39=0,v39=s[24]|0,t40=0,v40=s[23]|0,t41=0,v41=s[22]|0,t42=0,v42=s[21]|0,t43=0,v43=s[20]|0,t44=0,v44=s[19]|0,t45=0,v45=s[18]|0,t46=0,v46=s[17]|0,t47=0,v47=s[16]|0,t48=0,v48=s[15]|0,t49=0,v49=s[14]|0,t50=0,v50=s[13]|0,t51=0,v51=s[12]|0,t52=0,v52=s[11]|0,t53=0,v53=s[10]|0,t54=0,v54=s[9]|0,t55=0,v55=s[8]|0,t56=0,v56=s[7]|0,t57=0,v57=s[6]|0,t58=0,v58=s[5]|0,t59=0,v59=s[4]|0,t60=0,v60=s[3]|0,t61=0,v61=s[2]|0,t62=0,v62=s[1]|0,t63=0,v63=s[0]|0;

    		for (i = 0; i < l;) {
    			v0^=str.charCodeAt(i++);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    		}

    		while(i<l+3){
    			v0^=str.charCodeAt(i++);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    		}

    		return hashValHex(hl[v63>>8]+hl[v63&255]+hl[v62>>8]+hl[v62&255]+hl[v61>>8]+hl[v61&255]+hl[v60>>8]+hl[v60&255]+hl[v59>>8]+hl[v59&255]+hl[v58>>8]+hl[v58&255]+hl[v57>>8]+hl[v57&255]+hl[v56>>8]+hl[v56&255]+hl[v55>>8]+hl[v55&255]+hl[v54>>8]+hl[v54&255]+hl[v53>>8]+hl[v53&255]+hl[v52>>8]+hl[v52&255]+hl[v51>>8]+hl[v51&255]+hl[v50>>8]+hl[v50&255]+hl[v49>>8]+hl[v49&255]+hl[v48>>8]+hl[v48&255]+hl[v47>>8]+hl[v47&255]+hl[v46>>8]+hl[v46&255]+hl[v45>>8]+hl[v45&255]+hl[v44>>8]+hl[v44&255]+hl[v43>>8]+hl[v43&255]+hl[v42>>8]+hl[v42&255]+hl[v41>>8]+hl[v41&255]+hl[v40>>8]+hl[v40&255]+hl[v39>>8]+hl[v39&255]+hl[v38>>8]+hl[v38&255]+hl[v37>>8]+hl[v37&255]+hl[v36>>8]+hl[v36&255]+hl[v35>>8]+hl[v35&255]+hl[v34>>8]+hl[v34&255]+hl[v33>>8]+hl[v33&255]+hl[v32>>8]+hl[v32&255]+hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],1024);
    	}

    	function _hash1024_1(str){
    		var i,l=str.length-3,s=fnvConstants[1024].offset,t0=0,v0=s[63]|0,t1=0,v1=s[62]|0,t2=0,v2=s[61]|0,t3=0,v3=s[60]|0,t4=0,v4=s[59]|0,t5=0,v5=s[58]|0,t6=0,v6=s[57]|0,t7=0,v7=s[56]|0,t8=0,v8=s[55]|0,t9=0,v9=s[54]|0,t10=0,v10=s[53]|0,t11=0,v11=s[52]|0,t12=0,v12=s[51]|0,t13=0,v13=s[50]|0,t14=0,v14=s[49]|0,t15=0,v15=s[48]|0,t16=0,v16=s[47]|0,t17=0,v17=s[46]|0,t18=0,v18=s[45]|0,t19=0,v19=s[44]|0,t20=0,v20=s[43]|0,t21=0,v21=s[42]|0,t22=0,v22=s[41]|0,t23=0,v23=s[40]|0,t24=0,v24=s[39]|0,t25=0,v25=s[38]|0,t26=0,v26=s[37]|0,t27=0,v27=s[36]|0,t28=0,v28=s[35]|0,t29=0,v29=s[34]|0,t30=0,v30=s[33]|0,t31=0,v31=s[32]|0,t32=0,v32=s[31]|0,t33=0,v33=s[30]|0,t34=0,v34=s[29]|0,t35=0,v35=s[28]|0,t36=0,v36=s[27]|0,t37=0,v37=s[26]|0,t38=0,v38=s[25]|0,t39=0,v39=s[24]|0,t40=0,v40=s[23]|0,t41=0,v41=s[22]|0,t42=0,v42=s[21]|0,t43=0,v43=s[20]|0,t44=0,v44=s[19]|0,t45=0,v45=s[18]|0,t46=0,v46=s[17]|0,t47=0,v47=s[16]|0,t48=0,v48=s[15]|0,t49=0,v49=s[14]|0,t50=0,v50=s[13]|0,t51=0,v51=s[12]|0,t52=0,v52=s[11]|0,t53=0,v53=s[10]|0,t54=0,v54=s[9]|0,t55=0,v55=s[8]|0,t56=0,v56=s[7]|0,t57=0,v57=s[6]|0,t58=0,v58=s[5]|0,t59=0,v59=s[4]|0,t60=0,v60=s[3]|0,t61=0,v61=s[2]|0,t62=0,v62=s[1]|0,t63=0,v63=s[0]|0;

    		for (i = 0; i < l;) {
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			v0^=str.charCodeAt(i++);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		while(i<l+3){
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			v0^=str.charCodeAt(i++);
    		}

    		return hashValHex(hl[v63>>8]+hl[v63&255]+hl[v62>>8]+hl[v62&255]+hl[v61>>8]+hl[v61&255]+hl[v60>>8]+hl[v60&255]+hl[v59>>8]+hl[v59&255]+hl[v58>>8]+hl[v58&255]+hl[v57>>8]+hl[v57&255]+hl[v56>>8]+hl[v56&255]+hl[v55>>8]+hl[v55&255]+hl[v54>>8]+hl[v54&255]+hl[v53>>8]+hl[v53&255]+hl[v52>>8]+hl[v52&255]+hl[v51>>8]+hl[v51&255]+hl[v50>>8]+hl[v50&255]+hl[v49>>8]+hl[v49&255]+hl[v48>>8]+hl[v48&255]+hl[v47>>8]+hl[v47&255]+hl[v46>>8]+hl[v46&255]+hl[v45>>8]+hl[v45&255]+hl[v44>>8]+hl[v44&255]+hl[v43>>8]+hl[v43&255]+hl[v42>>8]+hl[v42&255]+hl[v41>>8]+hl[v41&255]+hl[v40>>8]+hl[v40&255]+hl[v39>>8]+hl[v39&255]+hl[v38>>8]+hl[v38&255]+hl[v37>>8]+hl[v37&255]+hl[v36>>8]+hl[v36&255]+hl[v35>>8]+hl[v35&255]+hl[v34>>8]+hl[v34&255]+hl[v33>>8]+hl[v33&255]+hl[v32>>8]+hl[v32&255]+hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],1024);
    	}

    	function _hash1024_1a_utf(str){
    		var c,i,l=str.length,s=fnvConstants[1024].offset,t0=0,v0=s[63]|0,t1=0,v1=s[62]|0,t2=0,v2=s[61]|0,t3=0,v3=s[60]|0,t4=0,v4=s[59]|0,t5=0,v5=s[58]|0,t6=0,v6=s[57]|0,t7=0,v7=s[56]|0,t8=0,v8=s[55]|0,t9=0,v9=s[54]|0,t10=0,v10=s[53]|0,t11=0,v11=s[52]|0,t12=0,v12=s[51]|0,t13=0,v13=s[50]|0,t14=0,v14=s[49]|0,t15=0,v15=s[48]|0,t16=0,v16=s[47]|0,t17=0,v17=s[46]|0,t18=0,v18=s[45]|0,t19=0,v19=s[44]|0,t20=0,v20=s[43]|0,t21=0,v21=s[42]|0,t22=0,v22=s[41]|0,t23=0,v23=s[40]|0,t24=0,v24=s[39]|0,t25=0,v25=s[38]|0,t26=0,v26=s[37]|0,t27=0,v27=s[36]|0,t28=0,v28=s[35]|0,t29=0,v29=s[34]|0,t30=0,v30=s[33]|0,t31=0,v31=s[32]|0,t32=0,v32=s[31]|0,t33=0,v33=s[30]|0,t34=0,v34=s[29]|0,t35=0,v35=s[28]|0,t36=0,v36=s[27]|0,t37=0,v37=s[26]|0,t38=0,v38=s[25]|0,t39=0,v39=s[24]|0,t40=0,v40=s[23]|0,t41=0,v41=s[22]|0,t42=0,v42=s[21]|0,t43=0,v43=s[20]|0,t44=0,v44=s[19]|0,t45=0,v45=s[18]|0,t46=0,v46=s[17]|0,t47=0,v47=s[16]|0,t48=0,v48=s[15]|0,t49=0,v49=s[14]|0,t50=0,v50=s[13]|0,t51=0,v51=s[12]|0,t52=0,v52=s[11]|0,t53=0,v53=s[10]|0,t54=0,v54=s[9]|0,t55=0,v55=s[8]|0,t56=0,v56=s[7]|0,t57=0,v57=s[6]|0,t58=0,v58=s[5]|0,t59=0,v59=s[4]|0,t60=0,v60=s[3]|0,t61=0,v61=s[2]|0,t62=0,v62=s[1]|0,t63=0,v63=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=(c&63)|128;
    			}
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    		}

    		return hashValHex(hl[v63>>8]+hl[v63&255]+hl[v62>>8]+hl[v62&255]+hl[v61>>8]+hl[v61&255]+hl[v60>>8]+hl[v60&255]+hl[v59>>8]+hl[v59&255]+hl[v58>>8]+hl[v58&255]+hl[v57>>8]+hl[v57&255]+hl[v56>>8]+hl[v56&255]+hl[v55>>8]+hl[v55&255]+hl[v54>>8]+hl[v54&255]+hl[v53>>8]+hl[v53&255]+hl[v52>>8]+hl[v52&255]+hl[v51>>8]+hl[v51&255]+hl[v50>>8]+hl[v50&255]+hl[v49>>8]+hl[v49&255]+hl[v48>>8]+hl[v48&255]+hl[v47>>8]+hl[v47&255]+hl[v46>>8]+hl[v46&255]+hl[v45>>8]+hl[v45&255]+hl[v44>>8]+hl[v44&255]+hl[v43>>8]+hl[v43&255]+hl[v42>>8]+hl[v42&255]+hl[v41>>8]+hl[v41&255]+hl[v40>>8]+hl[v40&255]+hl[v39>>8]+hl[v39&255]+hl[v38>>8]+hl[v38&255]+hl[v37>>8]+hl[v37&255]+hl[v36>>8]+hl[v36&255]+hl[v35>>8]+hl[v35&255]+hl[v34>>8]+hl[v34&255]+hl[v33>>8]+hl[v33&255]+hl[v32>>8]+hl[v32&255]+hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],1024);
    	}

    	function _hash1024_1_utf(str){
    		var c,i,l=str.length,s=fnvConstants[1024].offset,t0=0,v0=s[63]|0,t1=0,v1=s[62]|0,t2=0,v2=s[61]|0,t3=0,v3=s[60]|0,t4=0,v4=s[59]|0,t5=0,v5=s[58]|0,t6=0,v6=s[57]|0,t7=0,v7=s[56]|0,t8=0,v8=s[55]|0,t9=0,v9=s[54]|0,t10=0,v10=s[53]|0,t11=0,v11=s[52]|0,t12=0,v12=s[51]|0,t13=0,v13=s[50]|0,t14=0,v14=s[49]|0,t15=0,v15=s[48]|0,t16=0,v16=s[47]|0,t17=0,v17=s[46]|0,t18=0,v18=s[45]|0,t19=0,v19=s[44]|0,t20=0,v20=s[43]|0,t21=0,v21=s[42]|0,t22=0,v22=s[41]|0,t23=0,v23=s[40]|0,t24=0,v24=s[39]|0,t25=0,v25=s[38]|0,t26=0,v26=s[37]|0,t27=0,v27=s[36]|0,t28=0,v28=s[35]|0,t29=0,v29=s[34]|0,t30=0,v30=s[33]|0,t31=0,v31=s[32]|0,t32=0,v32=s[31]|0,t33=0,v33=s[30]|0,t34=0,v34=s[29]|0,t35=0,v35=s[28]|0,t36=0,v36=s[27]|0,t37=0,v37=s[26]|0,t38=0,v38=s[25]|0,t39=0,v39=s[24]|0,t40=0,v40=s[23]|0,t41=0,v41=s[22]|0,t42=0,v42=s[21]|0,t43=0,v43=s[20]|0,t44=0,v44=s[19]|0,t45=0,v45=s[18]|0,t46=0,v46=s[17]|0,t47=0,v47=s[16]|0,t48=0,v48=s[15]|0,t49=0,v49=s[14]|0,t50=0,v50=s[13]|0,t51=0,v51=s[12]|0,t52=0,v52=s[11]|0,t53=0,v53=s[10]|0,t54=0,v54=s[9]|0,t55=0,v55=s[8]|0,t56=0,v56=s[7]|0,t57=0,v57=s[6]|0,t58=0,v58=s[5]|0,t59=0,v59=s[4]|0,t60=0,v60=s[3]|0,t61=0,v61=s[2]|0,t62=0,v62=s[1]|0,t63=0,v63=s[0]|0;

    		for (i = 0; i < l; i++) {
    			c = str.charCodeAt(i);
    			t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    			t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    			t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    			if(c < 128){
    				v0^=c;
    			}else if(c < 2048){
    				v0^=(c>>6)|192;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=(c&63)|128;
    			}else if(((c&64512)==55296)&&(i+1)<l&&((str.charCodeAt(i+1)&64512)==56320)){
    				c=65536+((c&1023)<<10)+(str.charCodeAt(++i)&1023);
    				v0^=(c>>18)|240;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=((c>>12)&63)|128;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=(c&63)|128;
    			}else {
    				v0^=(c>>12)|224;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=((c>>6)&63)|128;
    				t0=v0*397;t1=v1*397;t2=v2*397;t3=v3*397;t4=v4*397;t5=v5*397;t6=v6*397;t7=v7*397;t8=v8*397;t9=v9*397;t10=v10*397;t11=v11*397;t12=v12*397;t13=v13*397;t14=v14*397;t15=v15*397;t16=v16*397;t17=v17*397;t18=v18*397;t19=v19*397;t20=v20*397;t21=v21*397;t22=v22*397;t23=v23*397;t24=v24*397;t25=v25*397;t26=v26*397;t27=v27*397;t28=v28*397;t29=v29*397;t30=v30*397;t31=v31*397;t32=v32*397;t33=v33*397;t34=v34*397;t35=v35*397;t36=v36*397;t37=v37*397;t38=v38*397;t39=v39*397;t40=v40*397;t41=v41*397;t42=v42*397;t43=v43*397;t44=v44*397;t45=v45*397;t46=v46*397;t47=v47*397;t48=v48*397;t49=v49*397;t50=v50*397;t51=v51*397;t52=v52*397;t53=v53*397;t54=v54*397;t55=v55*397;t56=v56*397;t57=v57*397;t58=v58*397;t59=v59*397;t60=v60*397;t61=v61*397;t62=v62*397;t63=v63*397;
    				t42+=v0<<8;t43+=v1<<8;t44+=v2<<8;t45+=v3<<8;t46+=v4<<8;t47+=v5<<8;t48+=v6<<8;t49+=v7<<8;t50+=v8<<8;t51+=v9<<8;t52+=v10<<8;t53+=v11<<8;t54+=v12<<8;t55+=v13<<8;t56+=v14<<8;t57+=v15<<8;t58+=v16<<8;t59+=v17<<8;t60+=v18<<8;t61+=v19<<8;t62+=v20<<8;t63+=v21<<8;
    				t1+=t0>>>16;v0=t0&65535;t2+=t1>>>16;v1=t1&65535;t3+=t2>>>16;v2=t2&65535;t4+=t3>>>16;v3=t3&65535;t5+=t4>>>16;v4=t4&65535;t6+=t5>>>16;v5=t5&65535;t7+=t6>>>16;v6=t6&65535;t8+=t7>>>16;v7=t7&65535;t9+=t8>>>16;v8=t8&65535;t10+=t9>>>16;v9=t9&65535;t11+=t10>>>16;v10=t10&65535;t12+=t11>>>16;v11=t11&65535;t13+=t12>>>16;v12=t12&65535;t14+=t13>>>16;v13=t13&65535;t15+=t14>>>16;v14=t14&65535;t16+=t15>>>16;v15=t15&65535;t17+=t16>>>16;v16=t16&65535;t18+=t17>>>16;v17=t17&65535;t19+=t18>>>16;v18=t18&65535;t20+=t19>>>16;v19=t19&65535;t21+=t20>>>16;v20=t20&65535;t22+=t21>>>16;v21=t21&65535;t23+=t22>>>16;v22=t22&65535;t24+=t23>>>16;v23=t23&65535;t25+=t24>>>16;v24=t24&65535;t26+=t25>>>16;v25=t25&65535;t27+=t26>>>16;v26=t26&65535;t28+=t27>>>16;v27=t27&65535;t29+=t28>>>16;v28=t28&65535;t30+=t29>>>16;v29=t29&65535;t31+=t30>>>16;v30=t30&65535;t32+=t31>>>16;v31=t31&65535;t33+=t32>>>16;v32=t32&65535;t34+=t33>>>16;v33=t33&65535;t35+=t34>>>16;v34=t34&65535;t36+=t35>>>16;v35=t35&65535;t37+=t36>>>16;v36=t36&65535;t38+=t37>>>16;v37=t37&65535;t39+=t38>>>16;v38=t38&65535;t40+=t39>>>16;v39=t39&65535;t41+=t40>>>16;v40=t40&65535;t42+=t41>>>16;v41=t41&65535;t43+=t42>>>16;v42=t42&65535;t44+=t43>>>16;v43=t43&65535;t45+=t44>>>16;v44=t44&65535;t46+=t45>>>16;v45=t45&65535;t47+=t46>>>16;v46=t46&65535;t48+=t47>>>16;v47=t47&65535;t49+=t48>>>16;v48=t48&65535;t50+=t49>>>16;v49=t49&65535;t51+=t50>>>16;v50=t50&65535;t52+=t51>>>16;v51=t51&65535;t53+=t52>>>16;v52=t52&65535;t54+=t53>>>16;v53=t53&65535;t55+=t54>>>16;v54=t54&65535;t56+=t55>>>16;v55=t55&65535;t57+=t56>>>16;v56=t56&65535;t58+=t57>>>16;v57=t57&65535;t59+=t58>>>16;v58=t58&65535;t60+=t59>>>16;v59=t59&65535;t61+=t60>>>16;v60=t60&65535;t62+=t61>>>16;v61=t61&65535;v63=(t63+(t62>>>16))&65535;v62=t62&65535;
    				v0^=(c&63)|128;
    			}
    		}

    		return hashValHex(hl[v63>>8]+hl[v63&255]+hl[v62>>8]+hl[v62&255]+hl[v61>>8]+hl[v61&255]+hl[v60>>8]+hl[v60&255]+hl[v59>>8]+hl[v59&255]+hl[v58>>8]+hl[v58&255]+hl[v57>>8]+hl[v57&255]+hl[v56>>8]+hl[v56&255]+hl[v55>>8]+hl[v55&255]+hl[v54>>8]+hl[v54&255]+hl[v53>>8]+hl[v53&255]+hl[v52>>8]+hl[v52&255]+hl[v51>>8]+hl[v51&255]+hl[v50>>8]+hl[v50&255]+hl[v49>>8]+hl[v49&255]+hl[v48>>8]+hl[v48&255]+hl[v47>>8]+hl[v47&255]+hl[v46>>8]+hl[v46&255]+hl[v45>>8]+hl[v45&255]+hl[v44>>8]+hl[v44&255]+hl[v43>>8]+hl[v43&255]+hl[v42>>8]+hl[v42&255]+hl[v41>>8]+hl[v41&255]+hl[v40>>8]+hl[v40&255]+hl[v39>>8]+hl[v39&255]+hl[v38>>8]+hl[v38&255]+hl[v37>>8]+hl[v37&255]+hl[v36>>8]+hl[v36&255]+hl[v35>>8]+hl[v35&255]+hl[v34>>8]+hl[v34&255]+hl[v33>>8]+hl[v33&255]+hl[v32>>8]+hl[v32&255]+hl[v31>>8]+hl[v31&255]+hl[v30>>8]+hl[v30&255]+hl[v29>>8]+hl[v29&255]+hl[v28>>8]+hl[v28&255]+hl[v27>>8]+hl[v27&255]+hl[v26>>8]+hl[v26&255]+hl[v25>>8]+hl[v25&255]+hl[v24>>8]+hl[v24&255]+hl[v23>>8]+hl[v23&255]+hl[v22>>8]+hl[v22&255]+hl[v21>>8]+hl[v21&255]+hl[v20>>8]+hl[v20&255]+hl[v19>>8]+hl[v19&255]+hl[v18>>8]+hl[v18&255]+hl[v17>>8]+hl[v17&255]+hl[v16>>8]+hl[v16&255]+hl[v15>>8]+hl[v15&255]+hl[v14>>8]+hl[v14&255]+hl[v13>>8]+hl[v13&255]+hl[v12>>8]+hl[v12&255]+hl[v11>>8]+hl[v11&255]+hl[v10>>8]+hl[v10&255]+hl[v9>>8]+hl[v9&255]+hl[v8>>8]+hl[v8&255]+hl[v7>>8]+hl[v7&255]+hl[v6>>8]+hl[v6&255]+hl[v5>>8]+hl[v5&255]+hl[v4>>8]+hl[v4&255]+hl[v3>>8]+hl[v3&255]+hl[v2>>8]+hl[v2&255]+hl[v1>>8]+hl[v1&255]+hl[v0>>8]+hl[v0&255],1024);
    	}

    	_hash1024 = _hash1024_1a;

    	// Init library.
    	setVersion('1a');
    	setUTF8(false);
    	seed();

    	return {
    		hash: hash,
    		setKeyspace: setKeyspace,
    		version: setVersion,
    		useUTF8: setUTF8,
    		seed: seed,
    		fast1a32: _hash32_1a_fast,
    		fast1a32hex:_hash32_1a_fast_hex,
    		fast1a52: _hash52_1a_fast,
    		fast1a52hex: _hash52_1a_fast_hex,
    		fast1a64: _hash64_1a_fast,
    		fast1a32utf: _hash32_1a_fast_utf,
    		fast1a32hexutf:_hash32_1a_fast_hex_utf,
    		fast1a52utf: _hash52_1a_fast_utf,
    		fast1a52hexutf: _hash52_1a_fast_hex_utf,
    		fast1a64utf: _hash64_1a_fast_utf
    	};
    })();

    module.exports = fnvplus;
    });

    /*

    Copyright 2020 0KIMS association.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    */

    function flatArray(a) {
        var res = [];
        fillArray(res, a);
        return res;

        function fillArray(res, a) {
            if (Array.isArray(a)) {
                for (let i=0; i<a.length; i++) {
                    fillArray(res, a[i]);
                }
            } else {
                res.push(a);
            }
        }
    }

    function fnvHash(str) {
        return fnvPlus.hash(str, 64).hex();
    }

    /* globals WebAssembly */

    async function builder(code, options) {

        options = options || {};

        let memorySize = 32767;
        let memory;
        let memoryAllocated = false;
        while (!memoryAllocated){
            try{
                memory = new WebAssembly.Memory({initial:memorySize});
                memoryAllocated = true;
            } catch(err){
                if(memorySize === 1){
                    throw err;
                }
                console.warn("Could not allocate " + memorySize * 1024 * 64 + " bytes. This may cause severe instability. Trying with " + memorySize * 1024 * 64 / 2 + " bytes");
                memorySize = Math.floor(memorySize/2);
            }
        }

        const wasmModule = await WebAssembly.compile(code);

        let wc;

        const instance = await WebAssembly.instantiate(wasmModule, {
            env: {
                "memory": memory
            },
            runtime: {
                error: function(code, pstr, a,b,c,d) {
                    let errStr;
                    if (code == 7) {
                        errStr=p2str(pstr) + " " + wc.getFr(b).toString() + " != " + wc.getFr(c).toString() + " " +p2str(d);
                    } else if (code == 9) {
                        errStr=p2str(pstr) + " " + wc.getFr(b).toString() + " " +p2str(c);
                    } else if ((code == 5)&&(options.sym)) {
                        errStr=p2str(pstr)+ " " + options.sym.labelIdx2Name[c];
                    } else {
                        errStr=p2str(pstr)+ " " + a + " " + b + " " + c + " " + d;
                    }
                    console.log("ERROR: ", code, errStr);
                    throw new Error(errStr);
                },
                log: function(a) {
                    console.log(wc.getFr(a).toString());
                },
                logGetSignal: function(signal, pVal) {
                    if (options.logGetSignal) {
                        options.logGetSignal(signal, wc.getFr(pVal) );
                    }
                },
                logSetSignal: function(signal, pVal) {
                    if (options.logSetSignal) {
                        options.logSetSignal(signal, wc.getFr(pVal) );
                    }
                },
                logStartComponent: function(cIdx) {
                    if (options.logStartComponent) {
                        options.logStartComponent(cIdx);
                    }
                },
                logFinishComponent: function(cIdx) {
                    if (options.logFinishComponent) {
                        options.logFinishComponent(cIdx);
                    }
                }
            }
        });

        const sanityCheck =
            options &&
            (
                options.sanityCheck ||
                options.logGetSignal ||
                options.logSetSignal ||
                options.logStartComponent ||
                options.logFinishComponent
            );

        wc = new WitnessCalculator(memory, instance, sanityCheck);
        return wc;

        function p2str(p) {
            const i8 = new Uint8Array(memory.buffer);

            const bytes = [];

            for (let i=0; i8[p+i]>0; i++)  bytes.push(i8[p+i]);

            return String.fromCharCode.apply(null, bytes);
        }
    }
    class WitnessCalculator {
        constructor(memory, instance, sanityCheck) {
            this.memory = memory;
            this.i32 = new Uint32Array(memory.buffer);
            this.instance = instance;

            this.n32 = (this.instance.exports.getFrLen() >> 2) - 2;
            const pRawPrime = this.instance.exports.getPRawPrime();

            const arr = new Array(this.n32);
            for (let i=0; i<this.n32; i++) {
                arr[this.n32-1-i] = this.i32[(pRawPrime >> 2) + i];
            }

            this.prime = Scalar$1.fromArray(arr, 0x100000000);

            this.Fr = new F1Field(this.prime);

            this.mask32 = Scalar$1.fromString("FFFFFFFF", 16);
            this.NVars = this.instance.exports.getNVars();
            this.n64 = Math.floor((this.Fr.bitLength - 1) / 64)+1;
            this.R = this.Fr.e( Scalar$1.shiftLeft(1 , this.n64*64));
            this.RInv = this.Fr.inv(this.R);
            this.sanityCheck = sanityCheck;
        }

        async _doCalculateWitness(input, sanityCheck) {
            this.instance.exports.init((this.sanityCheck || sanityCheck) ? 1 : 0);
            const pSigOffset = this.allocInt();
            const pFr = this.allocFr();
            const keys = Object.keys(input);
            keys.forEach( (k) => {
                const h = fnvHash(k);
                const hMSB = parseInt(h.slice(0,8), 16);
                const hLSB = parseInt(h.slice(8,16), 16);
                try {
                    this.instance.exports.getSignalOffset32(pSigOffset, 0, hMSB, hLSB);
                } catch (err) {
                    throw new Error(`Signal ${k} is not an input of the circuit.`);
                }
                const sigOffset = this.getInt(pSigOffset);
                const fArr = flatArray(input[k]);
                for (let i=0; i<fArr.length; i++) {
                    this.setFr(pFr, fArr[i]);
                    this.instance.exports.setSignal(0, 0, sigOffset + i, pFr);
                }
            });
        }

        async calculateWitness(input, sanityCheck) {
            const self = this;

            const old0 = self.i32[0];
            const w = [];

            await self._doCalculateWitness(input, sanityCheck);

            for (let i=0; i<self.NVars; i++) {
                const pWitness = self.instance.exports.getPWitness(i);
                w.push(self.getFr(pWitness));
            }

            self.i32[0] = old0;
            return w;
        }

        async calculateBinWitness(input, sanityCheck) {
            const self = this;

            const old0 = self.i32[0];

            await self._doCalculateWitness(input, sanityCheck);

            const pWitnessBuffer = self.instance.exports.getWitnessBuffer();

            self.i32[0] = old0;

            const buff = self.memory.buffer.slice(pWitnessBuffer, pWitnessBuffer + (self.NVars * self.n64 * 8));
            return new Uint8Array(buff);
        }

        allocInt() {
            const p = this.i32[0];
            this.i32[0] = p+8;
            return p;
        }

        allocFr() {
            const p = this.i32[0];
            this.i32[0] = p+this.n32*4 + 8;
            return p;
        }

        getInt(p) {
            return this.i32[p>>2];
        }

        setInt(p, v) {
            this.i32[p>>2] = v;
        }

        getFr(p) {
            const self = this;
            const idx = (p>>2);

            if (self.i32[idx + 1] & 0x80000000) {
                const arr = new Array(self.n32);
                for (let i=0; i<self.n32; i++) {
                    arr[self.n32-1-i] = self.i32[idx+2+i];
                }
                const res = self.Fr.e(Scalar$1.fromArray(arr, 0x100000000));
                if (self.i32[idx + 1] & 0x40000000) {
                    return fromMontgomery(res);
                } else {
                    return res;
                }

            } else {
                if (self.i32[idx] & 0x80000000) {
                    return self.Fr.e( self.i32[idx] - 0x100000000);
                } else {
                    return self.Fr.e(self.i32[idx]);
                }
            }

            function fromMontgomery(n) {
                return self.Fr.mul(self.RInv, n);
            }

        }


        setFr(p, v) {
            const self = this;

            v = self.Fr.e(v);

            const minShort = self.Fr.neg(self.Fr.e("80000000", 16));
            const maxShort = self.Fr.e("7FFFFFFF", 16);

            if (  (self.Fr.geq(v, minShort))
                &&(self.Fr.leq(v, maxShort)))
            {
                let a;
                if (self.Fr.geq(v, self.Fr.zero)) {
                    a = Scalar$1.toNumber(v);
                } else {
                    a = Scalar$1.toNumber( self.Fr.sub(v, minShort));
                    a = a - 0x80000000;
                    a = 0x100000000 + a;
                }
                self.i32[(p >> 2)] = a;
                self.i32[(p >> 2) + 1] = 0;
                return;
            }

            self.i32[(p >> 2)] = 0;
            self.i32[(p >> 2) + 1] = 0x80000000;
            const arr = Scalar$1.toArray(v, 0x100000000);
            for (let i=0; i<self.n32; i++) {
                const idx = arr.length-1-i;

                if ( idx >=0) {
                    self.i32[(p >> 2) + 2 + i] = arr[idx];
                } else {
                    self.i32[(p >> 2) + 2 + i] = 0;
                }
            }
        }
    }

    async function wtnsCalculate(input, wasmFileName, wtnsFileName, options) {

        const fdWasm = await readExisting$2(wasmFileName);
        const wasm = await fdWasm.read(fdWasm.totalSize);
        await fdWasm.close();

        const wc = await builder(wasm);
        const w = await wc.calculateBinWitness(input);

        const fdWtns = await createBinFile(wtnsFileName, "wtns", 2, 2);

        await writeBin(fdWtns, w, wc.prime);
        await fdWtns.close();

    }

    async function groth16FullProve(input, wasmFile, zkeyFileName, logger) {
        const wtns= {
            type: "mem"
        };
        await wtnsCalculate(input, wasmFile, wtns);
        return await groth16Prove(zkeyFileName, wtns, logger);
    }

    /*
        Copyright 2018 0kims association.

        This file is part of snarkjs.

        snarkjs is a free software: you can redistribute it and/or
        modify it under the terms of the GNU General Public License as published by the
        Free Software Foundation, either version 3 of the License, or (at your option)
        any later version.

        snarkjs is distributed in the hope that it will be useful,
        but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
        or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
        more details.

        You should have received a copy of the GNU General Public License along with
        snarkjs. If not, see <https://www.gnu.org/licenses/>.
    */
    const {unstringifyBigInts: unstringifyBigInts$3} = utils$1;

    async function groth16Verify(vk_verifier, publicSignals, proof, logger) {
    /*
        let cpub = vk_verifier.IC[0];
        for (let s= 0; s< vk_verifier.nPublic; s++) {
            cpub  = G1.add( cpub, G1.timesScalar( vk_verifier.IC[s+1], publicSignals[s]));
        }
    */

        vk_verifier = unstringifyBigInts$3(vk_verifier);
        proof = unstringifyBigInts$3(proof);
        publicSignals = unstringifyBigInts$3(publicSignals);

        const curve = await getCurveFromName(vk_verifier.curve);

        const IC0 = curve.G1.fromObject(vk_verifier.IC[0]);
        const IC = new Uint8Array(curve.G1.F.n8*2 * publicSignals.length);
        const w = new Uint8Array(curve.Fr.n8 * publicSignals.length);

        for (let i=0; i<publicSignals.length; i++) {
            const buffP = curve.G1.fromObject(vk_verifier.IC[i+1]);
            IC.set(buffP, i*curve.G1.F.n8*2);
            Scalar$1.toRprLE(w, curve.Fr.n8*i, publicSignals[i], curve.Fr.n8);
        }

        let cpub = await curve.G1.multiExpAffine(IC, w);
        cpub = curve.G1.add(cpub, IC0);

        const pi_a = curve.G1.fromObject(proof.pi_a);
        const pi_b = curve.G2.fromObject(proof.pi_b);
        const pi_c = curve.G1.fromObject(proof.pi_c);

        const vk_gamma_2 = curve.G2.fromObject(vk_verifier.vk_gamma_2);
        const vk_delta_2 = curve.G2.fromObject(vk_verifier.vk_delta_2);
        const vk_alpha_1 = curve.G1.fromObject(vk_verifier.vk_alpha_1);
        const vk_beta_2 = curve.G2.fromObject(vk_verifier.vk_beta_2);

        const res = await curve.pairingEq(
            curve.G1.neg(pi_a) , pi_b,
            cpub , vk_gamma_2,
            pi_c , vk_delta_2,

            vk_alpha_1, vk_beta_2
        );

        if (! res) {
            if (logger) logger.error("Invalid proof");
            return false;
        }

        if (logger) logger.info("OK!");
        return true;
    }

    var groth16 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fullProve: groth16FullProve,
        prove: groth16Prove,
        verify: groth16Verify
    });

    function hashToG2(curve, hash) {
        const hashV = new DataView(hash.buffer, hash.byteOffset, hash.byteLength);
        const seed = [];
        for (let i=0; i<8; i++) {
            seed[i] = hashV.getUint32(i*4);
        }

        const rng = new ChaCha(seed);

        const g2_sp = curve.G2.fromRng(rng);

        return g2_sp;
    }

    function getG2sp(curve, persinalization, challenge, g1s, g1sx) {

        const h = blake2bWasm(64);
        const b1 = new Uint8Array([persinalization]);
        h.update(b1);
        h.update(challenge);
        const b3 = curve.G1.toUncompressed(g1s);
        h.update( b3);
        const b4 = curve.G1.toUncompressed(g1sx);
        h.update( b4);
        const hash =h.digest();

        return hashToG2(curve, hash);
    }

    function calculatePubKey(k, curve, personalization, challengeHash, rng ) {
        k.g1_s = curve.G1.toAffine(curve.G1.fromRng(rng));
        k.g1_sx = curve.G1.toAffine(curve.G1.timesFr(k.g1_s, k.prvKey));
        k.g2_sp = curve.G2.toAffine(getG2sp(curve, personalization, challengeHash, k.g1_s, k.g1_sx));
        k.g2_spx = curve.G2.toAffine(curve.G2.timesFr(k.g2_sp, k.prvKey));
        return k;
    }

    function createPTauKey(curve, challengeHash, rng) {
        const key = {
            tau: {},
            alpha: {},
            beta: {}
        };
        key.tau.prvKey = curve.Fr.fromRng(rng);
        key.alpha.prvKey = curve.Fr.fromRng(rng);
        key.beta.prvKey = curve.Fr.fromRng(rng);
        calculatePubKey(key.tau, curve, 0, challengeHash, rng);
        calculatePubKey(key.alpha, curve, 1, challengeHash, rng);
        calculatePubKey(key.beta, curve, 2, challengeHash, rng);
        return key;
    }

    async function writePTauHeader(fd, curve, power, ceremonyPower) {
        // Write the header
        ///////////

        if (! ceremonyPower) ceremonyPower = power;
        await fd.writeULE32(1); // Header type
        const pHeaderSize = fd.pos;
        await fd.writeULE64(0); // Temporally set to 0 length

        await fd.writeULE32(curve.F1.n64*8);

        const buff = new Uint8Array(curve.F1.n8);
        Scalar$1.toRprLE(buff, 0, curve.q, curve.F1.n8);
        await fd.write(buff);
        await fd.writeULE32(power);                    // power
        await fd.writeULE32(ceremonyPower);               // power

        const headerSize = fd.pos - pHeaderSize - 8;

        const oldPos = fd.pos;

        await fd.writeULE64(headerSize, pHeaderSize);

        fd.pos = oldPos;
    }

    async function readPTauHeader(fd, sections) {
        if (!sections[1])  throw new Error(fd.fileName + ": File has no  header");
        if (sections[1].length>1) throw new Error(fd.fileName +": File has more than one header");

        fd.pos = sections[1][0].p;
        const n8 = await fd.readULE32();
        const buff = await fd.read(n8);
        const q = Scalar$1.fromRprLE(buff);

        const curve = await getCurveFromQ(q);

        if (curve.F1.n64*8 != n8) throw new Error(fd.fileName +": Invalid size");

        const power = await fd.readULE32();
        const ceremonyPower = await fd.readULE32();

        if (fd.pos-sections[1][0].p != sections[1][0].size) throw new Error("Invalid PTau header size");

        return {curve, power, ceremonyPower};
    }


    async function readPtauPubKey(fd, curve, montgomery) {

        const buff = await fd.read(curve.F1.n8*2*6 + curve.F2.n8*2*3);

        return fromPtauPubKeyRpr(buff, 0, curve, montgomery);
    }

    function fromPtauPubKeyRpr(buff, pos, curve, montgomery) {

        const key = {
            tau: {},
            alpha: {},
            beta: {}
        };

        key.tau.g1_s = readG1();
        key.tau.g1_sx = readG1();
        key.alpha.g1_s = readG1();
        key.alpha.g1_sx = readG1();
        key.beta.g1_s = readG1();
        key.beta.g1_sx = readG1();
        key.tau.g2_spx = readG2();
        key.alpha.g2_spx = readG2();
        key.beta.g2_spx = readG2();

        return key;

        function readG1() {
            let p;
            if (montgomery) {
                p = curve.G1.fromRprLEM( buff, pos );
            } else {
                p = curve.G1.fromRprUncompressed( buff, pos );
            }
            pos += curve.G1.F.n8*2;
            return p;
        }

        function readG2() {
            let p;
            if (montgomery) {
                p = curve.G2.fromRprLEM( buff, pos );
            } else {
                p = curve.G2.fromRprUncompressed( buff, pos );
            }
            pos += curve.G2.F.n8*2;
            return p;
        }
    }

    function toPtauPubKeyRpr(buff, pos, curve, key, montgomery) {

        writeG1(key.tau.g1_s);
        writeG1(key.tau.g1_sx);
        writeG1(key.alpha.g1_s);
        writeG1(key.alpha.g1_sx);
        writeG1(key.beta.g1_s);
        writeG1(key.beta.g1_sx);
        writeG2(key.tau.g2_spx);
        writeG2(key.alpha.g2_spx);
        writeG2(key.beta.g2_spx);

        async function writeG1(p) {
            if (montgomery) {
                curve.G1.toRprLEM(buff, pos, p);
            } else {
                curve.G1.toRprUncompressed(buff, pos, p);
            }
            pos += curve.F1.n8*2;
        }

        async function writeG2(p) {
            if (montgomery) {
                curve.G2.toRprLEM(buff, pos, p);
            } else {
                curve.G2.toRprUncompressed(buff, pos, p);
            }
            pos += curve.F2.n8*2;
        }

        return buff;
    }

    async function writePtauPubKey(fd, curve, key, montgomery) {
        const buff = new Uint8Array(curve.F1.n8*2*6 + curve.F2.n8*2*3);
        toPtauPubKeyRpr(buff, 0, curve, key, montgomery);
        await fd.write(buff);
    }

    async function readContribution$1(fd, curve) {
        const c = {};

        c.tauG1 = await readG1();
        c.tauG2 = await readG2();
        c.alphaG1 = await readG1();
        c.betaG1 = await readG1();
        c.betaG2 = await readG2();
        c.key = await readPtauPubKey(fd, curve, true);
        c.partialHash = await fd.read(216);
        c.nextChallenge = await fd.read(64);
        c.type = await fd.readULE32();

        const buffV  = new Uint8Array(curve.G1.F.n8*2*6+curve.G2.F.n8*2*3);
        toPtauPubKeyRpr(buffV, 0, curve, c.key, false);

        const responseHasher = blake2bWasm(64);
        responseHasher.setPartialHash(c.partialHash);
        responseHasher.update(buffV);
        c.responseHash = responseHasher.digest();

        const paramLength = await fd.readULE32();
        const curPos = fd.pos;
        let lastType =0;
        while (fd.pos-curPos < paramLength) {
            const buffType = await readDV(1);
            if (buffType[0]<= lastType) throw new Error("Parameters in the contribution must be sorted");
            lastType = buffType[0];
            if (buffType[0]==1) {     // Name
                const buffLen = await readDV(1);
                const buffStr = await readDV(buffLen[0]);
                c.name = new TextDecoder().decode(buffStr);
            } else if (buffType[0]==2) {
                const buffExp = await readDV(1);
                c.numIterationsExp = buffExp[0];
            } else if (buffType[0]==3) {
                const buffLen = await readDV(1);
                c.beaconHash = await readDV(buffLen[0]);
            } else {
                throw new Error("Parameter not recognized");
            }
        }
        if (fd.pos != curPos + paramLength) {
            throw new Error("Parametes do not match");
        }

        return c;

        async function readG1() {
            const pBuff = await fd.read(curve.G1.F.n8*2);
            return curve.G1.fromRprLEM( pBuff );
        }

        async function readG2() {
            const pBuff = await fd.read(curve.G2.F.n8*2);
            return curve.G2.fromRprLEM( pBuff );
        }

        async function readDV(n) {
            const b = await fd.read(n);
            return new Uint8Array(b);
        }
    }

    async function readContributions(fd, curve, sections) {
        if (!sections[7])  throw new Error(fd.fileName + ": File has no  contributions");
        if (sections[7][0].length>1) throw new Error(fd.fileName +": File has more than one contributions section");

        fd.pos = sections[7][0].p;
        const nContributions = await fd.readULE32();
        const contributions = [];
        for (let i=0; i<nContributions; i++) {
            const c = await readContribution$1(fd, curve);
            c.id = i+1;
            contributions.push(c);
        }

        if (fd.pos-sections[7][0].p != sections[7][0].size) throw new Error("Invalid contribution section size");

        return contributions;
    }

    async function writeContribution$1(fd, curve, contribution) {

        const buffG1 = new Uint8Array(curve.F1.n8*2);
        const buffG2 = new Uint8Array(curve.F2.n8*2);
        await writeG1(contribution.tauG1);
        await writeG2(contribution.tauG2);
        await writeG1(contribution.alphaG1);
        await writeG1(contribution.betaG1);
        await writeG2(contribution.betaG2);
        await writePtauPubKey(fd, curve, contribution.key, true);
        await fd.write(contribution.partialHash);
        await fd.write(contribution.nextChallenge);
        await fd.writeULE32(contribution.type || 0);

        const params = [];
        if (contribution.name) {
            params.push(1);      // Param Name
            const nameData = new TextEncoder("utf-8").encode(contribution.name.substring(0,64));
            params.push(nameData.byteLength);
            for (let i=0; i<nameData.byteLength; i++) params.push(nameData[i]);
        }
        if (contribution.type == 1) {
            params.push(2);      // Param numIterationsExp
            params.push(contribution.numIterationsExp);

            params.push(3);      // Beacon Hash
            params.push(contribution.beaconHash.byteLength);
            for (let i=0; i<contribution.beaconHash.byteLength; i++) params.push(contribution.beaconHash[i]);
        }
        if (params.length>0) {
            const paramsBuff = new Uint8Array(params);
            await fd.writeULE32(paramsBuff.byteLength);
            await fd.write(paramsBuff);
        } else {
            await fd.writeULE32(0);
        }


        async function writeG1(p) {
            curve.G1.toRprLEM(buffG1, 0, p);
            await fd.write(buffG1);
        }

        async function writeG2(p) {
            curve.G2.toRprLEM(buffG2, 0, p);
            await fd.write(buffG2);
        }

    }

    async function writeContributions(fd, curve, contributions) {

        await fd.writeULE32(7); // Header type
        const pContributionsSize = fd.pos;
        await fd.writeULE64(0); // Temporally set to 0 length

        await fd.writeULE32(contributions.length);
        for (let i=0; i< contributions.length; i++) {
            await writeContribution$1(fd, curve, contributions[i]);
        }
        const contributionsSize = fd.pos - pContributionsSize - 8;

        const oldPos = fd.pos;

        await fd.writeULE64(contributionsSize, pContributionsSize);
        fd.pos = oldPos;
    }

    function calculateFirstChallengeHash(curve, power, logger) {
        if (logger) logger.debug("Calculating First Challenge Hash");

        const hasher = new blake2bWasm(64);

        const vG1 = new Uint8Array(curve.G1.F.n8*2);
        const vG2 = new Uint8Array(curve.G2.F.n8*2);
        curve.G1.toRprUncompressed(vG1, 0, curve.G1.g);
        curve.G2.toRprUncompressed(vG2, 0, curve.G2.g);

        hasher.update(blake2bWasm(64).digest());

        let n;

        n=(2 ** power)*2 -1;
        if (logger) logger.debug("Calculate Initial Hash: tauG1");
        hashBlock(vG1, n);
        n= 2 ** power;
        if (logger) logger.debug("Calculate Initial Hash: tauG2");
        hashBlock(vG2, n);
        if (logger) logger.debug("Calculate Initial Hash: alphaTauG1");
        hashBlock(vG1, n);
        if (logger) logger.debug("Calculate Initial Hash: betaTauG1");
        hashBlock(vG1, n);
        hasher.update(vG2);

        return hasher.digest();

        function hashBlock(buff, n) {
            const blockSize = 500000;
            const nBlocks = Math.floor(n / blockSize);
            const rem = n % blockSize;
            const bigBuff = new Uint8Array(blockSize * buff.byteLength);
            for (let i=0; i<blockSize; i++) {
                bigBuff.set(buff, i*buff.byteLength);
            }
            for (let i=0; i<nBlocks; i++) {
                hasher.update(bigBuff);
                if (logger) logger.debug("Initial hash: " +i*blockSize);
            }
            for (let i=0; i<rem; i++) {
                hasher.update(buff);
            }
        }
    }


    function keyFromBeacon(curve, challengeHash, beaconHash, numIterationsExp) {

        const rng = rngFromBeaconParams(beaconHash, numIterationsExp);

        const key = createPTauKey(curve, challengeHash, rng);

        return key;
    }

    /*
    Header(1)
        n8
        prime
        power
    tauG1(2)
        {(2 ** power)*2-1} [
            G1, tau*G1, tau^2 * G1, ....
        ]
    tauG2(3)
        {2 ** power}[
            G2, tau*G2, tau^2 * G2, ...
        ]
    alphaTauG1(4)
        {2 ** power}[
            alpha*G1, alpha*tau*G1, alpha*tau^2*G1,....
        ]
    betaTauG1(5)
        {2 ** power} []
            beta*G1, beta*tau*G1, beta*tau^2*G1, ....
        ]
    betaG2(6)
        {1}[
            beta*G2
        ]
    contributions(7)
        NContributions
        {NContributions}[
            tau*G1
            tau*G2
            alpha*G1
            beta*G1
            beta*G2
            pubKey
                tau_g1s
                tau_g1sx
                tau_g2spx
                alpha_g1s
                alpha_g1sx
                alpha_g1spx
                beta_g1s
                beta_g1sx
                beta_g1spx
            partialHash (216 bytes) See https://github.com/mafintosh/blake2b-wasm/blob/23bee06945806309977af802bc374727542617c7/blake2b.wat#L9
            hashNewChallenge
        ]
     */

    async function newAccumulator(curve, power, fileName, logger) {

        await blake2bWasm.ready();

        const fd = await createBinFile(fileName, "ptau", 1, 7);

        await writePTauHeader(fd, curve, power, 0);

        const buffG1 = curve.G1.oneAffine;
        const buffG2 = curve.G2.oneAffine;

        // Write tauG1
        ///////////
        await startWriteSection(fd, 2);
        const nTauG1 = (2 ** power) * 2 -1;
        for (let i=0; i< nTauG1; i++) {
            await fd.write(buffG1);
            if ((logger)&&((i%100000) == 0)&&i) logger.log("tauG1: " + i);
        }
        await endWriteSection(fd);

        // Write tauG2
        ///////////
        await startWriteSection(fd, 3);
        const nTauG2 = (2 ** power);
        for (let i=0; i< nTauG2; i++) {
            await fd.write(buffG2);
            if ((logger)&&((i%100000) == 0)&&i) logger.log("tauG2: " + i);
        }
        await endWriteSection(fd);

        // Write alphaTauG1
        ///////////
        await startWriteSection(fd, 4);
        const nAlfaTauG1 = (2 ** power);
        for (let i=0; i< nAlfaTauG1; i++) {
            await fd.write(buffG1);
            if ((logger)&&((i%100000) == 0)&&i) logger.log("alphaTauG1: " + i);
        }
        await endWriteSection(fd);

        // Write betaTauG1
        ///////////
        await startWriteSection(fd, 5);
        const nBetaTauG1 = (2 ** power);
        for (let i=0; i< nBetaTauG1; i++) {
            await fd.write(buffG1);
            if ((logger)&&((i%100000) == 0)&&i) logger.log("betaTauG1: " + i);
        }
        await endWriteSection(fd);

        // Write betaG2
        ///////////
        await startWriteSection(fd, 6);
        await fd.write(buffG2);
        await endWriteSection(fd);

        // Contributions
        ///////////
        await startWriteSection(fd, 7);
        await fd.writeULE32(0); // 0 Contributions
        await endWriteSection(fd);

        await fd.close();

        const firstChallengeHash = calculateFirstChallengeHash(curve, power, logger);

        if (logger) logger.debug(formatHash(blake2bWasm(64).digest(), "Blank Contribution Hash:"));

        if (logger) logger.info(formatHash(firstChallengeHash, "First Contribution Hash:"));

        return firstChallengeHash;

    }

    // Format of the outpu

    async function exportChallenge(pTauFilename, challengeFilename, logger) {
        await blake2bWasm.ready();
        const {fd: fdFrom, sections} = await readBinFile(pTauFilename, "ptau", 1);

        const {curve, power} = await readPTauHeader(fdFrom, sections);

        const contributions = await readContributions(fdFrom, curve, sections);
        let lastResponseHash, curChallengeHash;
        if (contributions.length == 0) {
            lastResponseHash = blake2bWasm(64).digest();
            curChallengeHash = calculateFirstChallengeHash(curve, power);
        } else {
            lastResponseHash = contributions[contributions.length-1].responseHash;
            curChallengeHash = contributions[contributions.length-1].nextChallenge;
        }

        if (logger) logger.info(formatHash(lastResponseHash, "Last Response Hash: "));

        if (logger) logger.info(formatHash(curChallengeHash, "New Challenge Hash: "));


        const fdTo = await createOverride(challengeFilename);

        const toHash = blake2bWasm(64);
        await fdTo.write(lastResponseHash);
        toHash.update(lastResponseHash);

        await exportSection(2, "G1", (2 ** power) * 2 -1, "tauG1");
        await exportSection(3, "G2", (2 ** power)       , "tauG2");
        await exportSection(4, "G1", (2 ** power)       , "alphaTauG1");
        await exportSection(5, "G1", (2 ** power)       , "betaTauG1");
        await exportSection(6, "G2", 1                  , "betaG2");

        await fdFrom.close();
        await fdTo.close();

        const calcCurChallengeHash = toHash.digest();

        if (!hashIsEqual (curChallengeHash, calcCurChallengeHash)) {
            if (logger) logger.info(formatHash(calcCurChallengeHash, "Calc Curret Challenge Hash: "));

            if (logger) logger.error("PTau file is corrupted. Calculated new challenge hash does not match with the eclared one");
            throw new Error("PTau file is corrupted. Calculated new challenge hash does not match with the eclared one");
        }

        return curChallengeHash;

        async function exportSection(sectionId, groupName, nPoints, sectionName) {
            const G = curve[groupName];
            const sG = G.F.n8*2;
            const nPointsChunk = Math.floor((1<<24)/sG);

            await startReadUniqueSection(fdFrom, sections, sectionId);
            for (let i=0; i< nPoints; i+= nPointsChunk) {
                if (logger) logger.debug(`Exporting ${sectionName}: ${i}/${nPoints}`);
                const n = Math.min(nPoints-i, nPointsChunk);
                let buff;
                buff = await fdFrom.read(n*sG);
                buff = await G.batchLEMtoU(buff);
                await fdTo.write(buff);
                toHash.update(buff);
            }
            await endReadSection(fdFrom);
        }


    }

    async function importResponse(oldPtauFilename, contributionFilename, newPTauFilename, name, importPoints, logger) {

        await blake2bWasm.ready();

        const noHash = new Uint8Array(64);
        for (let i=0; i<64; i++) noHash[i] = 0xFF;

        const {fd: fdOld, sections} = await readBinFile(oldPtauFilename, "ptau", 1);
        const {curve, power} = await readPTauHeader(fdOld, sections);
        const contributions = await readContributions(fdOld, curve, sections);
        const currentContribution = {};

        if (name) currentContribution.name = name;

        const sG1 = curve.F1.n8*2;
        const scG1 = curve.F1.n8; // Compresed size
        const sG2 = curve.F2.n8*2;
        const scG2 = curve.F2.n8; // Compresed size

        const fdResponse = await readExisting$2(contributionFilename);

        if  (fdResponse.totalSize !=
            64 +                            // Old Hash
            ((2 ** power)*2-1)*scG1 +
            (2 ** power)*scG2 +
            (2 ** power)*scG1 +
            (2 ** power)*scG1 +
            scG2 +
            sG1*6 + sG2*3)
            throw new Error("Size of the contribution is invalid");

        let lastChallengeHash;

        if (contributions.length>0) {
            lastChallengeHash = contributions[contributions.length-1].nextChallenge;
        } else {
            lastChallengeHash = calculateFirstChallengeHash(curve, power, logger);
        }

        const fdNew = await createBinFile(newPTauFilename, "ptau", 1, importPoints ? 7: 2);
        await writePTauHeader(fdNew, curve, power);

        const contributionPreviousHash = await fdResponse.read(64);

        if (hashIsEqual(noHash,lastChallengeHash)) {
            lastChallengeHash = contributionPreviousHash;
            contributions[contributions.length-1].nextChallenge = lastChallengeHash;
        }

        if(!hashIsEqual(contributionPreviousHash,lastChallengeHash))
            throw new Error("Wrong contribution. this contribution is not based on the previus hash");

        const hasherResponse = new blake2bWasm(64);
        hasherResponse.update(contributionPreviousHash);

        const startSections = [];
        let res;
        res = await processSection(fdResponse, fdNew, "G1", 2, (2 ** power) * 2 -1, [1], "tauG1");
        currentContribution.tauG1 = res[0];
        res = await processSection(fdResponse, fdNew, "G2", 3, (2 ** power)       , [1], "tauG2");
        currentContribution.tauG2 = res[0];
        res = await processSection(fdResponse, fdNew, "G1", 4, (2 ** power)       , [0], "alphaG1");
        currentContribution.alphaG1 = res[0];
        res = await processSection(fdResponse, fdNew, "G1", 5, (2 ** power)       , [0], "betaG1");
        currentContribution.betaG1 = res[0];
        res = await processSection(fdResponse, fdNew, "G2", 6, 1                  , [0], "betaG2");
        currentContribution.betaG2 = res[0];

        currentContribution.partialHash = hasherResponse.getPartialHash();


        const buffKey = await fdResponse.read(curve.F1.n8*2*6+curve.F2.n8*2*3);

        currentContribution.key = fromPtauPubKeyRpr(buffKey, 0, curve, false);

        hasherResponse.update(new Uint8Array(buffKey));
        const hashResponse = hasherResponse.digest();

        if (logger) logger.info(formatHash(hashResponse, "Contribution Response Hash imported: "));

        if (importPoints) {
            const nextChallengeHasher = new blake2bWasm(64);
            nextChallengeHasher.update(hashResponse);

            await hashSection(nextChallengeHasher, fdNew, "G1", 2, (2 ** power) * 2 -1, "tauG1", logger);
            await hashSection(nextChallengeHasher, fdNew, "G2", 3, (2 ** power)       , "tauG2", logger);
            await hashSection(nextChallengeHasher, fdNew, "G1", 4, (2 ** power)       , "alphaTauG1", logger);
            await hashSection(nextChallengeHasher, fdNew, "G1", 5, (2 ** power)       , "betaTauG1", logger);
            await hashSection(nextChallengeHasher, fdNew, "G2", 6, 1                  , "betaG2", logger);

            currentContribution.nextChallenge = nextChallengeHasher.digest();

            if (logger) logger.info(formatHash(currentContribution.nextChallenge, "Next Challenge Hash: "));
        } else {
            currentContribution.nextChallenge = noHash;
        }

        contributions.push(currentContribution);

        await writeContributions(fdNew, curve, contributions);

        await fdResponse.close();
        await fdNew.close();
        await fdOld.close();

        return currentContribution.nextChallenge;

        async function processSection(fdFrom, fdTo, groupName, sectionId, nPoints, singularPointIndexes, sectionName) {
            if (importPoints) {
                return await processSectionImportPoints(fdFrom, fdTo, groupName, sectionId, nPoints, singularPointIndexes, sectionName);
            } else {
                return await processSectionNoImportPoints(fdFrom, fdTo, groupName, sectionId, nPoints, singularPointIndexes, sectionName);
            }
        }

        async function processSectionImportPoints(fdFrom, fdTo, groupName, sectionId, nPoints, singularPointIndexes, sectionName) {

            const G = curve[groupName];
            const scG = G.F.n8;
            const sG = G.F.n8*2;

            const singularPoints = [];

            await startWriteSection(fdTo, sectionId);
            const nPointsChunk = Math.floor((1<<24)/sG);

            startSections[sectionId] = fdTo.pos;

            for (let i=0; i< nPoints; i += nPointsChunk) {
                if (logger) logger.debug(`Importing ${sectionName}: ${i}/${nPoints}`);
                const n = Math.min(nPoints-i, nPointsChunk);

                const buffC = await fdFrom.read(n * scG);
                hasherResponse.update(buffC);

                const buffLEM = await G.batchCtoLEM(buffC);

                await fdTo.write(buffLEM);
                for (let j=0; j<singularPointIndexes.length; j++) {
                    const sp = singularPointIndexes[j];
                    if ((sp >=i) && (sp < i+n)) {
                        const P = G.fromRprLEM(buffLEM, (sp-i)*sG);
                        singularPoints.push(P);
                    }
                }
            }

            await endWriteSection(fdTo);

            return singularPoints;
        }


        async function processSectionNoImportPoints(fdFrom, fdTo, groupName, sectionId, nPoints, singularPointIndexes, sectionName) {

            const G = curve[groupName];
            const scG = G.F.n8;

            const singularPoints = [];

            const nPointsChunk = Math.floor((1<<24)/scG);

            for (let i=0; i< nPoints; i += nPointsChunk) {
                if (logger) logger.debug(`Importing ${sectionName}: ${i}/${nPoints}`);
                const n = Math.min(nPoints-i, nPointsChunk);

                const buffC = await fdFrom.read(n * scG);
                hasherResponse.update(buffC);

                for (let j=0; j<singularPointIndexes.length; j++) {
                    const sp = singularPointIndexes[j];
                    if ((sp >=i) && (sp < i+n)) {
                        const P = G.fromRprCompressed(buffC, (sp-i)*scG);
                        singularPoints.push(P);
                    }
                }
            }

            return singularPoints;
        }


        async function hashSection(nextChallengeHasher, fdTo, groupName, sectionId, nPoints, sectionName, logger) {

            const G = curve[groupName];
            const sG = G.F.n8*2;
            const nPointsChunk = Math.floor((1<<24)/sG);

            const oldPos = fdTo.pos;
            fdTo.pos = startSections[sectionId];

            for (let i=0; i< nPoints; i += nPointsChunk) {
                if (logger) logger.debug(`Hashing ${sectionName}: ${i}/${nPoints}`);
                const n = Math.min(nPoints-i, nPointsChunk);

                const buffLEM = await fdTo.read(n * sG);

                const buffU = await G.batchLEMtoU(buffLEM);

                nextChallengeHasher.update(buffU);
            }

            fdTo.pos = oldPos;
        }

    }

    const sameRatio$1 = sameRatio;

    async function verifyContribution(curve, cur, prev, logger) {
        let sr;
        if (cur.type == 1) {    // Verify the beacon.
            const beaconKey = keyFromBeacon(curve, prev.nextChallenge, cur.beaconHash, cur.numIterationsExp);

            if (!curve.G1.eq(cur.key.tau.g1_s, beaconKey.tau.g1_s)) {
                if (logger) logger.error(`BEACON key (tauG1_s) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }
            if (!curve.G1.eq(cur.key.tau.g1_sx, beaconKey.tau.g1_sx)) {
                if (logger) logger.error(`BEACON key (tauG1_sx) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }
            if (!curve.G2.eq(cur.key.tau.g2_spx, beaconKey.tau.g2_spx)) {
                if (logger) logger.error(`BEACON key (tauG2_spx) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }

            if (!curve.G1.eq(cur.key.alpha.g1_s, beaconKey.alpha.g1_s)) {
                if (logger) logger.error(`BEACON key (alphaG1_s) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }
            if (!curve.G1.eq(cur.key.alpha.g1_sx, beaconKey.alpha.g1_sx)) {
                if (logger) logger.error(`BEACON key (alphaG1_sx) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }
            if (!curve.G2.eq(cur.key.alpha.g2_spx, beaconKey.alpha.g2_spx)) {
                if (logger) logger.error(`BEACON key (alphaG2_spx) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }

            if (!curve.G1.eq(cur.key.beta.g1_s, beaconKey.beta.g1_s)) {
                if (logger) logger.error(`BEACON key (betaG1_s) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }
            if (!curve.G1.eq(cur.key.beta.g1_sx, beaconKey.beta.g1_sx)) {
                if (logger) logger.error(`BEACON key (betaG1_sx) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }
            if (!curve.G2.eq(cur.key.beta.g2_spx, beaconKey.beta.g2_spx)) {
                if (logger) logger.error(`BEACON key (betaG2_spx) is not generated correctly in challenge #${cur.id}  ${cur.name || ""}` );
                return false;
            }
        }

        cur.key.tau.g2_sp = curve.G2.toAffine(getG2sp(curve, 0, prev.nextChallenge, cur.key.tau.g1_s, cur.key.tau.g1_sx));
        cur.key.alpha.g2_sp = curve.G2.toAffine(getG2sp(curve, 1, prev.nextChallenge, cur.key.alpha.g1_s, cur.key.alpha.g1_sx));
        cur.key.beta.g2_sp = curve.G2.toAffine(getG2sp(curve, 2, prev.nextChallenge, cur.key.beta.g1_s, cur.key.beta.g1_sx));

        sr = await sameRatio$1(curve, cur.key.tau.g1_s, cur.key.tau.g1_sx, cur.key.tau.g2_sp, cur.key.tau.g2_spx);
        if (sr !== true) {
            if (logger) logger.error("INVALID key (tau) in challenge #"+cur.id);
            return false;
        }

        sr = await sameRatio$1(curve, cur.key.alpha.g1_s, cur.key.alpha.g1_sx, cur.key.alpha.g2_sp, cur.key.alpha.g2_spx);
        if (sr !== true) {
            if (logger) logger.error("INVALID key (alpha) in challenge #"+cur.id);
            return false;
        }

        sr = await sameRatio$1(curve, cur.key.beta.g1_s, cur.key.beta.g1_sx, cur.key.beta.g2_sp, cur.key.beta.g2_spx);
        if (sr !== true) {
            if (logger) logger.error("INVALID key (beta) in challenge #"+cur.id);
            return false;
        }

        sr = await sameRatio$1(curve, prev.tauG1, cur.tauG1, cur.key.tau.g2_sp, cur.key.tau.g2_spx);
        if (sr !== true) {
            if (logger) logger.error("INVALID tau*G1. challenge #"+cur.id+" It does not follow the previous contribution");
            return false;
        }

        sr = await sameRatio$1(curve,  cur.key.tau.g1_s, cur.key.tau.g1_sx, prev.tauG2, cur.tauG2);
        if (sr !== true) {
            if (logger) logger.error("INVALID tau*G2. challenge #"+cur.id+" It does not follow the previous contribution");
            return false;
        }

        sr = await sameRatio$1(curve, prev.alphaG1, cur.alphaG1, cur.key.alpha.g2_sp, cur.key.alpha.g2_spx);
        if (sr !== true) {
            if (logger) logger.error("INVALID alpha*G1. challenge #"+cur.id+" It does not follow the previous contribution");
            return false;
        }

        sr = await sameRatio$1(curve, prev.betaG1, cur.betaG1, cur.key.beta.g2_sp, cur.key.beta.g2_spx);
        if (sr !== true) {
            if (logger) logger.error("INVALID beta*G1. challenge #"+cur.id+" It does not follow the previous contribution");
            return false;
        }

        sr = await sameRatio$1(curve,  cur.key.beta.g1_s, cur.key.beta.g1_sx, prev.betaG2, cur.betaG2);
        if (sr !== true) {
            if (logger) logger.error("INVALID beta*G2. challenge #"+cur.id+"It does not follow the previous contribution");
            return false;
        }

        if (logger) logger.info("Powers Of tau file OK!");
        return true;
    }

    async function verify(tauFilename, logger) {
        let sr;
        await blake2bWasm.ready();

        const {fd, sections} = await readBinFile(tauFilename, "ptau", 1);
        const {curve, power, ceremonyPower} = await readPTauHeader(fd, sections);
        const contrs = await readContributions(fd, curve, sections);

        if (logger) logger.debug("power: 2**" + power);
        // Verify Last contribution

        if (logger) logger.debug("Computing initial contribution hash");
        const initialContribution = {
            tauG1: curve.G1.g,
            tauG2: curve.G2.g,
            alphaG1: curve.G1.g,
            betaG1: curve.G1.g,
            betaG2: curve.G2.g,
            nextChallenge: calculateFirstChallengeHash(curve, ceremonyPower, logger),
            responseHash: blake2bWasm(64).digest()
        };

        if (contrs.length == 0) {
            if (logger) logger.error("This file has no contribution! It cannot be used in production");
            return false;
        }

        let prevContr;
        if (contrs.length>1) {
            prevContr = contrs[contrs.length-2];
        } else {
            prevContr = initialContribution;
        }
        const curContr = contrs[contrs.length-1];
        if (logger) logger.debug("Validating contribution #"+contrs[contrs.length-1].id);
        const res = await verifyContribution(curve, curContr, prevContr, logger);
        if (!res) return false;


        const nextContributionHasher = blake2bWasm(64);
        nextContributionHasher.update(curContr.responseHash);

        // Verify powers and compute nextChallengeHash

        // await test();

        // Verify Section tau*G1
        if (logger) logger.debug("Verifying powers in tau*G1 section");
        const rTau1 = await processSection(2, "G1", "tauG1", (2 ** power)*2-1, [0, 1], logger);
        sr = await sameRatio$1(curve, rTau1.R1, rTau1.R2, curve.G2.g, curContr.tauG2);
        if (sr !== true) {
            if (logger) logger.error("tauG1 section. Powers do not match");
            return false;
        }
        if (!curve.G1.eq(curve.G1.g, rTau1.singularPoints[0])) {
            if (logger) logger.error("First element of tau*G1 section must be the generator");
            return false;
        }
        if (!curve.G1.eq(curContr.tauG1, rTau1.singularPoints[1])) {
            if (logger) logger.error("Second element of tau*G1 section does not match the one in the contribution section");
            return false;
        }

        // await test();

        // Verify Section tau*G2
        if (logger) logger.debug("Verifying powers in tau*G2 section");
        const rTau2 = await processSection(3, "G2", "tauG2", 2 ** power, [0, 1],  logger);
        sr = await sameRatio$1(curve, curve.G1.g, curContr.tauG1, rTau2.R1, rTau2.R2);
        if (sr !== true) {
            if (logger) logger.error("tauG2 section. Powers do not match");
            return false;
        }
        if (!curve.G2.eq(curve.G2.g, rTau2.singularPoints[0])) {
            if (logger) logger.error("First element of tau*G2 section must be the generator");
            return false;
        }
        if (!curve.G2.eq(curContr.tauG2, rTau2.singularPoints[1])) {
            if (logger) logger.error("Second element of tau*G2 section does not match the one in the contribution section");
            return false;
        }

        // Verify Section alpha*tau*G1
        if (logger) logger.debug("Verifying powers in alpha*tau*G1 section");
        const rAlphaTauG1 = await processSection(4, "G1", "alphatauG1", 2 ** power, [0], logger);
        sr = await sameRatio$1(curve, rAlphaTauG1.R1, rAlphaTauG1.R2, curve.G2.g, curContr.tauG2);
        if (sr !== true) {
            if (logger) logger.error("alphaTauG1 section. Powers do not match");
            return false;
        }
        if (!curve.G1.eq(curContr.alphaG1, rAlphaTauG1.singularPoints[0])) {
            if (logger) logger.error("First element of alpha*tau*G1 section (alpha*G1) does not match the one in the contribution section");
            return false;
        }

        // Verify Section beta*tau*G1
        if (logger) logger.debug("Verifying powers in beta*tau*G1 section");
        const rBetaTauG1 = await processSection(5, "G1", "betatauG1", 2 ** power, [0], logger);
        sr = await sameRatio$1(curve, rBetaTauG1.R1, rBetaTauG1.R2, curve.G2.g, curContr.tauG2);
        if (sr !== true) {
            if (logger) logger.error("betaTauG1 section. Powers do not match");
            return false;
        }
        if (!curve.G1.eq(curContr.betaG1, rBetaTauG1.singularPoints[0])) {
            if (logger) logger.error("First element of beta*tau*G1 section (beta*G1) does not match the one in the contribution section");
            return false;
        }

        //Verify Beta G2
        const betaG2 = await processSectionBetaG2(logger);
        if (!curve.G2.eq(curContr.betaG2, betaG2)) {
            if (logger) logger.error("betaG2 element in betaG2 section does not match the one in the contribution section");
            return false;
        }


        const nextContributionHash = nextContributionHasher.digest();

        // Check the nextChallengeHash
        if (power == ceremonyPower) {
            if (!hashIsEqual(nextContributionHash,curContr.nextChallenge)) {
                if (logger) logger.error("Hash of the values does not match the next challenge of the last contributor in the contributions section");
                return false;
            }
        }

        if (logger) logger.info(formatHash(nextContributionHash, "Next challenge hash: "));

        // Verify Previous contributions

        printContribution(curContr, prevContr);
        for (let i = contrs.length-2; i>=0; i--) {
            const curContr = contrs[i];
            const prevContr =  (i>0) ? contrs[i-1] : initialContribution;
            const res = await verifyContribution(curve, curContr, prevContr, logger);
            if (!res) return false;
            printContribution(curContr, prevContr);
        }
        if (logger) logger.info("-----------------------------------------------------");

        if ((!sections[12]) || (!sections[13]) || (!sections[14]) || (!sections[15])) {
            if (logger) logger.warn(
                "this file does not contain phase2 precalculated values. Please run: \n" +
                "   snarkjs \"powersoftau preparephase2\" to prepare this file to be used in the phase2 ceremony."
            );
        } else {
            let res;
            res = await verifyLagrangeEvaluations("G1", 2, 12, "tauG1", logger);
            if (!res) return false;
            res = await verifyLagrangeEvaluations("G2", 3, 13, "tauG2", logger);
            if (!res) return false;
            res = await verifyLagrangeEvaluations("G1", 4, 14, "alphaTauG1", logger);
            if (!res) return false;
            res = await verifyLagrangeEvaluations("G1", 5, 15, "betaTauG1", logger);
            if (!res) return false;
        }

        await fd.close();

        if (logger) logger.info("Powers of Tau Ok!");

        return true;

        function printContribution(curContr, prevContr) {
            if (!logger) return;
            logger.info("-----------------------------------------------------");
            logger.info(`Contribution #${curContr.id}: ${curContr.name ||""}`);

            logger.info(formatHash(curContr.nextChallenge, "Next Challenge: "));

            const buffV  = new Uint8Array(curve.G1.F.n8*2*6+curve.G2.F.n8*2*3);
            toPtauPubKeyRpr(buffV, 0, curve, curContr.key, false);

            const responseHasher = blake2bWasm(64);
            responseHasher.setPartialHash(curContr.partialHash);
            responseHasher.update(buffV);
            const responseHash = responseHasher.digest();

            logger.info(formatHash(responseHash, "Response Hash:"));

            logger.info(formatHash(prevContr.nextChallenge, "Response Hash:"));

            if (curContr.type == 1) {
                logger.info(`Beacon generator: ${byteArray2hex(curContr.beaconHash)}`);
                logger.info(`Beacon iterations Exp: ${curContr.numIterationsExp}`);
            }

        }

        async function processSectionBetaG2(logger) {
            const G = curve.G2;
            const sG = G.F.n8*2;
            const buffUv = new Uint8Array(sG);

            if (!sections[6])  {
                logger.error("File has no BetaG2 section");
                throw new Error("File has no BetaG2 section");
            }
            if (sections[6].length>1) {
                logger.error("File has no BetaG2 section");
                throw new Error("File has more than one GetaG2 section");
            }
            fd.pos = sections[6][0].p;

            const buff = await fd.read(sG);
            const P = G.fromRprLEM(buff);

            G.toRprUncompressed(buffUv, 0, P);
            nextContributionHasher.update(buffUv);

            return P;
        }

        async function processSection(idSection, groupName, sectionName, nPoints, singularPointIndexes, logger) {
            const MAX_CHUNK_SIZE = 1<<16;
            const G = curve[groupName];
            const sG = G.F.n8*2;
            await startReadUniqueSection(fd, sections, idSection);

            const singularPoints = [];

            let R1 = G.zero;
            let R2 = G.zero;

            let lastBase = G.zero;

            for (let i=0; i<nPoints; i += MAX_CHUNK_SIZE) {
                if (logger) logger.debug(`points relations: ${sectionName}: ${i}/${nPoints} `);
                const n = Math.min(nPoints - i, MAX_CHUNK_SIZE);
                const bases = await fd.read(n*sG);

                const basesU = await G.batchLEMtoU(bases);
                nextContributionHasher.update(basesU);

                const scalars = new Uint8Array(4*(n-1));
                crypto.randomFillSync(scalars);


                if (i>0) {
                    const firstBase = G.fromRprLEM(bases, 0);
                    const r = crypto.randomBytes(4).readUInt32BE(0, true);

                    R1 = G.add(R1, G.timesScalar(lastBase, r));
                    R2 = G.add(R2, G.timesScalar(firstBase, r));
                }

                const r1 = await G.multiExpAffine(bases.slice(0, (n-1)*sG), scalars);
                const r2 = await G.multiExpAffine(bases.slice(sG), scalars);

                R1 = G.add(R1, r1);
                R2 = G.add(R2, r2);

                lastBase = G.fromRprLEM( bases, (n-1)*sG);

                for (let j=0; j<singularPointIndexes.length; j++) {
                    const sp = singularPointIndexes[j];
                    if ((sp >=i) && (sp < i+n)) {
                        const P = G.fromRprLEM(bases, (sp-i)*sG);
                        singularPoints.push(P);
                    }
                }

            }
            await endReadSection(fd);

            return {
                R1: R1,
                R2: R2,
                singularPoints: singularPoints
            };

        }

        async function verifyLagrangeEvaluations(gName, tauSection, lagrangeSection, sectionName, logger) {

            if (logger) logger.debug(`Verifying phase2 calculated values ${sectionName}...`);
            const G = curve[gName];
            const sG = G.F.n8*2;

            const seed= new Array(8);
            for (let i=0; i<8; i++) {
                seed[i] = crypto.randomBytes(4).readUInt32BE(0, true);
            }

            for (let p=0; p<= power; p ++) {
                const res = await verifyPower(p);
                if (!res) return false;
            }

            if (tauSection == 2) {
                const res = await verifyPower(power+1);
                if (!res) return false;
            }

            return true;

            async function verifyPower(p) {
                if (logger) logger.debug(`Power ${p}...`);
                const n8r = curve.Fr.n8;
                const nPoints = 2 ** p;
                let buff_r = new Uint32Array(nPoints);
                let buffG;

                let rng = new ChaCha(seed);

                if (logger) logger.debug(`Creating random numbers Powers${p}...`);
                for (let i=0; i<nPoints; i++) {
                    if ((p == power+1)&&(i == nPoints-1)) {
                        buff_r[i] = 0;
                    } else {
                        buff_r[i] = rng.nextU32();
                    }
                }

                buff_r = new Uint8Array(buff_r.buffer, buff_r.byteOffset, buff_r.byteLength);

                if (logger) logger.debug(`reading points Powers${p}...`);
                await startReadUniqueSection(fd, sections, tauSection);
                buffG = new BigBuffer(nPoints*sG);
                if (p == power+1) {
                    await fd.readToBuffer(buffG, 0, (nPoints-1)*sG);
                    buffG.set(curve.G1.zeroAffine, (nPoints-1)*sG);
                } else {
                    await fd.readToBuffer(buffG, 0, nPoints*sG);
                }
                await endReadSection(fd, true);

                const resTau = await G.multiExpAffine(buffG, buff_r, logger, sectionName + "_" + p);

                buff_r = new BigBuffer(nPoints * n8r);

                rng = new ChaCha(seed);

                const buff4 = new Uint8Array(4);
                const buff4V = new DataView(buff4.buffer);

                if (logger) logger.debug(`Creating random numbers Powers${p}...`);
                for (let i=0; i<nPoints; i++) {
                    if ((i != nPoints-1) || (p != power+1)) {
                        buff4V.setUint32(0, rng.nextU32(), true);
                        buff_r.set(buff4, i*n8r);
                    }
                }

                if (logger) logger.debug(`batchToMontgomery ${p}...`);
                buff_r = await curve.Fr.batchToMontgomery(buff_r);
                if (logger) logger.debug(`fft ${p}...`);
                buff_r = await curve.Fr.fft(buff_r);
                if (logger) logger.debug(`batchFromMontgomery ${p}...`);
                buff_r = await curve.Fr.batchFromMontgomery(buff_r);

                if (logger) logger.debug(`reading points Lagrange${p}...`);
                await startReadUniqueSection(fd, sections, lagrangeSection);
                fd.pos += sG*((2 ** p)-1);
                await fd.readToBuffer(buffG, 0, nPoints*sG);
                await endReadSection(fd, true);

                const resLagrange = await G.multiExpAffine(buffG, buff_r, logger, sectionName + "_" + p + "_transformed");

                if (!G.eq(resTau, resLagrange)) {
                    if (logger) logger.error("Phase2 caclutation does not match with powers of tau");
                    return false;
                }

                return true;
            }
        }
    }

    /*
        This function creates a new section in the fdTo file with id idSection.
        It multiplies the pooints in fdFrom by first, first*inc, first*inc^2, ....
        nPoint Times.
        It also updates the newChallengeHasher with the new points
    */

    async function applyKeyToSection(fdOld, sections, fdNew, idSection, curve, groupName, first, inc, sectionName, logger) {
        const MAX_CHUNK_SIZE = 1 << 16;
        const G = curve[groupName];
        const sG = G.F.n8*2;
        const nPoints = sections[idSection][0].size / sG;

        await startReadUniqueSection(fdOld, sections,idSection );
        await startWriteSection(fdNew, idSection);

        let t = first;
        for (let i=0; i<nPoints; i += MAX_CHUNK_SIZE) {
            if (logger) logger.debug(`Applying key: ${sectionName}: ${i}/${nPoints}`);
            const n= Math.min(nPoints - i, MAX_CHUNK_SIZE);
            let buff;
            buff = await fdOld.read(n*sG);
            buff = await G.batchApplyKey(buff, t, inc);
            await fdNew.write(buff);
            t = curve.Fr.mul(t, curve.Fr.exp(inc, n));
        }

        await endWriteSection(fdNew);
        await endReadSection(fdOld);
    }



    async function applyKeyToChallengeSection(fdOld, fdNew, responseHasher, curve, groupName, nPoints, first, inc, formatOut, sectionName, logger) {
        const G = curve[groupName];
        const sG = G.F.n8*2;
        const chunkSize = Math.floor((1<<20) / sG);   // 128Mb chunks
        let t = first;
        for (let i=0 ; i<nPoints ; i+= chunkSize) {
            if (logger) logger.debug(`Applying key ${sectionName}: ${i}/${nPoints}`);
            const n= Math.min(nPoints-i, chunkSize );
            const buffInU = await fdOld.read(n * sG);
            const buffInLEM = await G.batchUtoLEM(buffInU);
            const buffOutLEM = await G.batchApplyKey(buffInLEM, t, inc);
            let buffOut;
            if (formatOut == "COMPRESSED") {
                buffOut = await G.batchLEMtoC(buffOutLEM);
            } else {
                buffOut = await G.batchLEMtoU(buffOutLEM);
            }

            if (responseHasher) responseHasher.update(buffOut);
            await fdNew.write(buffOut);
            t = curve.Fr.mul(t, curve.Fr.exp(inc, n));
        }
    }

    // Format of the output

    async function challengeContribute(curve, challengeFilename, responesFileName, entropy, logger) {
        await blake2bWasm.ready();

        const fdFrom = await readExisting$2(challengeFilename);


        const sG1 = curve.F1.n64*8*2;
        const sG2 = curve.F2.n64*8*2;
        const domainSize = (fdFrom.totalSize + sG1 - 64 - sG2) / (4*sG1 + sG2);
        let e = domainSize;
        let power = 0;
        while (e>1) {
            e = e /2;
            power += 1;
        }

        if (2 ** power != domainSize) throw new Error("Invalid file size");
        if (logger) logger.debug("Power to tau size: "+power);

        const rng = await getRandomRng(entropy);

        const fdTo = await createOverride(responesFileName);

        // Calculate the hash
        const challengeHasher = blake2bWasm(64);
        for (let i=0; i<fdFrom.totalSize; i+= fdFrom.pageSize) {
            if (logger) logger.debug(`Hashing challenge ${i}/${fdFrom.totalSize}`);
            const s = Math.min(fdFrom.totalSize - i, fdFrom.pageSize);
            const buff = await fdFrom.read(s);
            challengeHasher.update(buff);
        }

        const claimedHash = await fdFrom.read(64, 0);
        if (logger) logger.info(formatHash(claimedHash, "Claimed Previous Response Hash: "));

        const challengeHash = challengeHasher.digest();
        if (logger) logger.info(formatHash(challengeHash, "Current Challenge Hash: "));

        const key = createPTauKey(curve, challengeHash, rng);

        if (logger) {
            ["tau", "alpha", "beta"].forEach( (k) => {
                logger.debug(k + ".g1_s: " + curve.G1.toString(key[k].g1_s, 16));
                logger.debug(k + ".g1_sx: " + curve.G1.toString(key[k].g1_sx, 16));
                logger.debug(k + ".g2_sp: " + curve.G2.toString(key[k].g2_sp, 16));
                logger.debug(k + ".g2_spx: " + curve.G2.toString(key[k].g2_spx, 16));
                logger.debug("");
            });
        }

        const responseHasher = blake2bWasm(64);

        await fdTo.write(challengeHash);
        responseHasher.update(challengeHash);

        await applyKeyToChallengeSection(fdFrom, fdTo, responseHasher, curve, "G1", (2 ** power)*2-1, curve.Fr.one    , key.tau.prvKey, "COMPRESSED", "tauG1"     , logger );
        await applyKeyToChallengeSection(fdFrom, fdTo, responseHasher, curve, "G2", (2 ** power)    , curve.Fr.one    , key.tau.prvKey, "COMPRESSED", "tauG2"     , logger );
        await applyKeyToChallengeSection(fdFrom, fdTo, responseHasher, curve, "G1", (2 ** power)    , key.alpha.prvKey, key.tau.prvKey, "COMPRESSED", "alphaTauG1", logger );
        await applyKeyToChallengeSection(fdFrom, fdTo, responseHasher, curve, "G1", (2 ** power)    , key.beta.prvKey , key.tau.prvKey, "COMPRESSED", "betaTauG1" , logger );
        await applyKeyToChallengeSection(fdFrom, fdTo, responseHasher, curve, "G2", 1             , key.beta.prvKey , key.tau.prvKey, "COMPRESSED", "betaTauG2" , logger );

        // Write and hash key
        const buffKey = new Uint8Array(curve.F1.n8*2*6+curve.F2.n8*2*3);
        toPtauPubKeyRpr(buffKey, 0, curve, key, false);
        await fdTo.write(buffKey);
        responseHasher.update(buffKey);
        const responseHash = responseHasher.digest();
        if (logger) logger.info(formatHash(responseHash, "Contribution Response Hash: "));

        await fdTo.close();
        await fdFrom.close();
    }

    async function beacon(oldPtauFilename, newPTauFilename, name,  beaconHashStr,numIterationsExp, logger) {
        const beaconHash = hex2ByteArray(beaconHashStr);
        if (   (beaconHash.byteLength == 0)
            || (beaconHash.byteLength*2 !=beaconHashStr.length))
        {
            if (logger) logger.error("Invalid Beacon Hash. (It must be a valid hexadecimal sequence)");
            return false;
        }
        if (beaconHash.length>=256) {
            if (logger) logger.error("Maximum lenght of beacon hash is 255 bytes");
            return false;
        }

        numIterationsExp = parseInt(numIterationsExp);
        if ((numIterationsExp<10)||(numIterationsExp>63)) {
            if (logger) logger.error("Invalid numIterationsExp. (Must be between 10 and 63)");
            return false;
        }


        await blake2bWasm.ready();

        const {fd: fdOld, sections} = await readBinFile(oldPtauFilename, "ptau", 1);
        const {curve, power, ceremonyPower} = await readPTauHeader(fdOld, sections);
        if (power != ceremonyPower) {
            if (logger) logger.error("This file has been reduced. You cannot contribute into a reduced file.");
            return false;
        }
        if (sections[12]) {
            if (logger) logger.warn("Contributing into a file that has phase2 calculated. You will have to prepare phase2 again.");
        }
        const contributions = await readContributions(fdOld, curve, sections);
        const curContribution = {
            name: name,
            type: 1, // Beacon
            numIterationsExp: numIterationsExp,
            beaconHash: beaconHash
        };

        let lastChallengeHash;

        if (contributions.length>0) {
            lastChallengeHash = contributions[contributions.length-1].nextChallenge;
        } else {
            lastChallengeHash = calculateFirstChallengeHash(curve, power, logger);
        }

        curContribution.key = keyFromBeacon(curve, lastChallengeHash, beaconHash, numIterationsExp);

        const responseHasher = new blake2bWasm(64);
        responseHasher.update(lastChallengeHash);

        const fdNew = await createBinFile(newPTauFilename, "ptau", 1, 7);
        await writePTauHeader(fdNew, curve, power);

        const startSections = [];

        let firstPoints;
        firstPoints = await processSection(2, "G1",  (2 ** power) * 2 -1, curve.Fr.e(1), curContribution.key.tau.prvKey, "tauG1", logger );
        curContribution.tauG1 = firstPoints[1];
        firstPoints = await processSection(3, "G2",  (2 ** power) , curve.Fr.e(1), curContribution.key.tau.prvKey, "tauG2", logger );
        curContribution.tauG2 = firstPoints[1];
        firstPoints = await processSection(4, "G1",  (2 ** power) , curContribution.key.alpha.prvKey, curContribution.key.tau.prvKey, "alphaTauG1", logger );
        curContribution.alphaG1 = firstPoints[0];
        firstPoints = await processSection(5, "G1",  (2 ** power) , curContribution.key.beta.prvKey, curContribution.key.tau.prvKey, "betaTauG1", logger );
        curContribution.betaG1 = firstPoints[0];
        firstPoints = await processSection(6, "G2",  1, curContribution.key.beta.prvKey, curContribution.key.tau.prvKey, "betaTauG2", logger );
        curContribution.betaG2 = firstPoints[0];

        curContribution.partialHash = responseHasher.getPartialHash();

        const buffKey = new Uint8Array(curve.F1.n8*2*6+curve.F2.n8*2*3);

        toPtauPubKeyRpr(buffKey, 0, curve, curContribution.key, false);

        responseHasher.update(new Uint8Array(buffKey));
        const hashResponse = responseHasher.digest();

        if (logger) logger.info(formatHash(hashResponse, "Contribution Response Hash imported: "));

        const nextChallengeHasher = new blake2bWasm(64);
        nextChallengeHasher.update(hashResponse);

        await hashSection(fdNew, "G1", 2, (2 ** power) * 2 -1, "tauG1", logger);
        await hashSection(fdNew, "G2", 3, (2 ** power)       , "tauG2", logger);
        await hashSection(fdNew, "G1", 4, (2 ** power)       , "alphaTauG1", logger);
        await hashSection(fdNew, "G1", 5, (2 ** power)       , "betaTauG1", logger);
        await hashSection(fdNew, "G2", 6, 1                  , "betaG2", logger);

        curContribution.nextChallenge = nextChallengeHasher.digest();

        if (logger) logger.info(formatHash(curContribution.nextChallenge, "Next Challenge Hash: "));

        contributions.push(curContribution);

        await writeContributions(fdNew, curve, contributions);

        await fdOld.close();
        await fdNew.close();

        return hashResponse;

        async function processSection(sectionId, groupName, NPoints, first, inc, sectionName, logger) {
            const res = [];
            fdOld.pos = sections[sectionId][0].p;

            await startWriteSection(fdNew, sectionId);

            startSections[sectionId] = fdNew.pos;

            const G = curve[groupName];
            const sG = G.F.n8*2;
            const chunkSize = Math.floor((1<<20) / sG);   // 128Mb chunks
            let t = first;
            for (let i=0 ; i<NPoints ; i+= chunkSize) {
                if (logger) logger.debug(`applying key${sectionName}: ${i}/${NPoints}`);
                const n= Math.min(NPoints-i, chunkSize );
                const buffIn = await fdOld.read(n * sG);
                const buffOutLEM = await G.batchApplyKey(buffIn, t, inc);

                /* Code to test the case where we don't have the 2^m-2 component
                if (sectionName== "tauG1") {
                    const bz = new Uint8Array(64);
                    buffOutLEM.set(bz, 64*((2 ** power) - 1 ));
                }
                */

                const promiseWrite = fdNew.write(buffOutLEM);
                const buffOutC = await G.batchLEMtoC(buffOutLEM);

                responseHasher.update(buffOutC);
                await promiseWrite;
                if (i==0)   // Return the 2 first points.
                    for (let j=0; j<Math.min(2, NPoints); j++)
                        res.push(G.fromRprLEM(buffOutLEM, j*sG));
                t = curve.Fr.mul(t, curve.Fr.exp(inc, n));
            }

            await endWriteSection(fdNew);

            return res;
        }


        async function hashSection(fdTo, groupName, sectionId, nPoints, sectionName, logger) {

            const G = curve[groupName];
            const sG = G.F.n8*2;
            const nPointsChunk = Math.floor((1<<24)/sG);

            const oldPos = fdTo.pos;
            fdTo.pos = startSections[sectionId];

            for (let i=0; i< nPoints; i += nPointsChunk) {
                if (logger) logger.debug(`Hashing ${sectionName}: ${i}/${nPoints}`);
                const n = Math.min(nPoints-i, nPointsChunk);

                const buffLEM = await fdTo.read(n * sG);

                const buffU = await G.batchLEMtoU(buffLEM);

                nextChallengeHasher.update(buffU);
            }

            fdTo.pos = oldPos;
        }
    }

    // Format of the output

    async function contribute(oldPtauFilename, newPTauFilename, name, entropy, logger) {
        await blake2bWasm.ready();

        const {fd: fdOld, sections} = await readBinFile(oldPtauFilename, "ptau", 1);
        const {curve, power, ceremonyPower} = await readPTauHeader(fdOld, sections);
        if (power != ceremonyPower) {
            if (logger) logger.error("This file has been reduced. You cannot contribute into a reduced file.");
            throw new Error("This file has been reduced. You cannot contribute into a reduced file.");
        }
        if (sections[12]) {
            if (logger) logger.warn("WARNING: Contributing into a file that has phase2 calculated. You will have to prepare phase2 again.");
        }
        const contributions = await readContributions(fdOld, curve, sections);
        const curContribution = {
            name: name,
            type: 0, // Beacon
        };

        let lastChallengeHash;

        const rng = await getRandomRng(entropy);

        if (contributions.length>0) {
            lastChallengeHash = contributions[contributions.length-1].nextChallenge;
        } else {
            lastChallengeHash = calculateFirstChallengeHash(curve, power, logger);
        }

        // Generate a random key


        curContribution.key = createPTauKey(curve, lastChallengeHash, rng);


        const responseHasher = new blake2bWasm(64);
        responseHasher.update(lastChallengeHash);

        const fdNew = await createBinFile(newPTauFilename, "ptau", 1, 7);
        await writePTauHeader(fdNew, curve, power);

        const startSections = [];

        let firstPoints;
        firstPoints = await processSection(2, "G1",  (2 ** power) * 2 -1, curve.Fr.e(1), curContribution.key.tau.prvKey, "tauG1" );
        curContribution.tauG1 = firstPoints[1];
        firstPoints = await processSection(3, "G2",  (2 ** power) , curve.Fr.e(1), curContribution.key.tau.prvKey, "tauG2" );
        curContribution.tauG2 = firstPoints[1];
        firstPoints = await processSection(4, "G1",  (2 ** power) , curContribution.key.alpha.prvKey, curContribution.key.tau.prvKey, "alphaTauG1" );
        curContribution.alphaG1 = firstPoints[0];
        firstPoints = await processSection(5, "G1",  (2 ** power) , curContribution.key.beta.prvKey, curContribution.key.tau.prvKey, "betaTauG1" );
        curContribution.betaG1 = firstPoints[0];
        firstPoints = await processSection(6, "G2",  1, curContribution.key.beta.prvKey, curContribution.key.tau.prvKey, "betaTauG2" );
        curContribution.betaG2 = firstPoints[0];

        curContribution.partialHash = responseHasher.getPartialHash();

        const buffKey = new Uint8Array(curve.F1.n8*2*6+curve.F2.n8*2*3);

        toPtauPubKeyRpr(buffKey, 0, curve, curContribution.key, false);

        responseHasher.update(new Uint8Array(buffKey));
        const hashResponse = responseHasher.digest();

        if (logger) logger.info(formatHash(hashResponse, "Contribution Response Hash imported: "));

        const nextChallengeHasher = new blake2bWasm(64);
        nextChallengeHasher.update(hashResponse);

        await hashSection(fdNew, "G1", 2, (2 ** power) * 2 -1, "tauG1");
        await hashSection(fdNew, "G2", 3, (2 ** power)       , "tauG2");
        await hashSection(fdNew, "G1", 4, (2 ** power)       , "alphaTauG1");
        await hashSection(fdNew, "G1", 5, (2 ** power)       , "betaTauG1");
        await hashSection(fdNew, "G2", 6, 1                  , "betaG2");

        curContribution.nextChallenge = nextChallengeHasher.digest();

        if (logger) logger.info(formatHash(curContribution.nextChallenge, "Next Challenge Hash: "));

        contributions.push(curContribution);

        await writeContributions(fdNew, curve, contributions);

        await fdOld.close();
        await fdNew.close();

        return hashResponse;

        async function processSection(sectionId, groupName, NPoints, first, inc, sectionName) {
            const res = [];
            fdOld.pos = sections[sectionId][0].p;

            await startWriteSection(fdNew, sectionId);

            startSections[sectionId] = fdNew.pos;

            const G = curve[groupName];
            const sG = G.F.n8*2;
            const chunkSize = Math.floor((1<<20) / sG);   // 128Mb chunks
            let t = first;
            for (let i=0 ; i<NPoints ; i+= chunkSize) {
                if (logger) logger.debug(`processing: ${sectionName}: ${i}/${NPoints}`);
                const n= Math.min(NPoints-i, chunkSize );
                const buffIn = await fdOld.read(n * sG);
                const buffOutLEM = await G.batchApplyKey(buffIn, t, inc);

                /* Code to test the case where we don't have the 2^m-2 component
                if (sectionName== "tauG1") {
                    const bz = new Uint8Array(64);
                    buffOutLEM.set(bz, 64*((2 ** power) - 1 ));
                }
                */

                const promiseWrite = fdNew.write(buffOutLEM);
                const buffOutC = await G.batchLEMtoC(buffOutLEM);

                responseHasher.update(buffOutC);
                await promiseWrite;
                if (i==0)   // Return the 2 first points.
                    for (let j=0; j<Math.min(2, NPoints); j++)
                        res.push(G.fromRprLEM(buffOutLEM, j*sG));
                t = curve.Fr.mul(t, curve.Fr.exp(inc, n));
            }

            await endWriteSection(fdNew);

            return res;
        }


        async function hashSection(fdTo, groupName, sectionId, nPoints, sectionName) {

            const G = curve[groupName];
            const sG = G.F.n8*2;
            const nPointsChunk = Math.floor((1<<24)/sG);

            const oldPos = fdTo.pos;
            fdTo.pos = startSections[sectionId];

            for (let i=0; i< nPoints; i += nPointsChunk) {
                if ((logger)&&i) logger.debug(`Hashing ${sectionName}: ` + i);
                const n = Math.min(nPoints-i, nPointsChunk);

                const buffLEM = await fdTo.read(n * sG);

                const buffU = await G.batchLEMtoU(buffLEM);

                nextChallengeHasher.update(buffU);
            }

            fdTo.pos = oldPos;
        }


    }

    async function preparePhase2(oldPtauFilename, newPTauFilename, logger) {

        const {fd: fdOld, sections} = await readBinFile(oldPtauFilename, "ptau", 1);
        const {curve, power} = await readPTauHeader(fdOld, sections);

        const fdNew = await createBinFile(newPTauFilename, "ptau", 1, 11);
        await writePTauHeader(fdNew, curve, power);

        await copySection(fdOld, sections, fdNew, 2);
        await copySection(fdOld, sections, fdNew, 3);
        await copySection(fdOld, sections, fdNew, 4);
        await copySection(fdOld, sections, fdNew, 5);
        await copySection(fdOld, sections, fdNew, 6);
        await copySection(fdOld, sections, fdNew, 7);

        await processSection(2, 12, "G1", "tauG1" );
        await processSection(3, 13, "G2", "tauG2" );
        await processSection(4, 14, "G1", "alphaTauG1" );
        await processSection(5, 15, "G1", "betaTauG1" );

        await fdOld.close();
        await fdNew.close();

        // await fs.promises.unlink(newPTauFilename+ ".tmp");

        return;

        async function processSection(oldSectionId, newSectionId, Gstr, sectionName) {
            if (logger) logger.debug("Starting section: "+sectionName);

            await startWriteSection(fdNew, newSectionId);

            for (let p=0; p<=power; p++) {
                await processSectionPower(p);
            }

            if (oldSectionId == 2) {
                await processSectionPower(power+1);
            }

            await endWriteSection(fdNew);


            async function processSectionPower(p) {
                const nPoints = 2 ** p;
                const G = curve[Gstr];
                const Fr = curve.Fr;
                const sGin = G.F.n8*2;
                const sGmid = G.F.n8*3;

                let buff;
                buff = new BigBuffer(nPoints*sGin);

                await startReadUniqueSection(fdOld, sections, oldSectionId);
                if ((oldSectionId == 2)&&(p==power+1)) {
                    await fdOld.readToBuffer(buff, 0,(nPoints-1)*sGin );
                    buff.set(curve.G1.zeroAffine, (nPoints-1)*sGin );
                } else {
                    await fdOld.readToBuffer(buff, 0,nPoints*sGin );
                }
                await endReadSection(fdOld, true);


                buff = await G.lagrangeEvaluations(buff, "affine", "affine", logger, sectionName);
                await fdNew.write(buff);

    /*
                if (p <= curve.Fr.s) {
                    buff = await G.ifft(buff, "affine", "affine", logger, sectionName);
                    await fdNew.write(buff);
                } else if (p == curve.Fr.s+1) {
                    const smallM = 1<<curve.Fr.s;
                    let t0 = new BigBuffer( smallM * sGmid );
                    let t1 = new BigBuffer( smallM * sGmid );

                    const shift_to_small_m = Fr.exp(Fr.shift, smallM);
                    const one_over_denom = Fr.inv(Fr.sub(shift_to_small_m, Fr.one));

                    let sInvAcc = Fr.one;
                    for (let i=0; i<smallM; i++) {
                        const ti =  buff.slice(i*sGin, (i+1)*sGin);
                        const tmi = buff.slice((i+smallM)*sGin, (i+smallM+1)*sGin);

                        t0.set(
                            G.timesFr(
                                G.sub(
                                    G.timesFr(ti , shift_to_small_m),
                                    tmi
                                ),
                                one_over_denom
                            ),
                            i*sGmid
                        );
                        t1.set(
                            G.timesFr(
                                G.sub( tmi, ti),
                                Fr.mul(sInvAcc, one_over_denom)
                            ),
                            i*sGmid
                        );


                        sInvAcc = Fr.mul(sInvAcc, Fr.shiftInv);
                    }
                    t0 = await G.ifft(t0, "jacobian", "affine", logger, sectionName + " t0");
                    await fdNew.write(t0);
                    t0 = null;
                    t1 = await G.ifft(t1, "jacobian", "affine", logger, sectionName + " t0");
                    await fdNew.write(t1);

                } else {
                    if (logger) logger.error("Power too big");
                    throw new Error("Power to big");
                }
    */
            }
        }
    }

    async function truncate(ptauFilename, template, logger) {

        const {fd: fdOld, sections} = await readBinFile(ptauFilename, "ptau", 1);
        const {curve, power, ceremonyPower} = await readPTauHeader(fdOld, sections);

        const sG1 = curve.G1.F.n8*2;
        const sG2 = curve.G2.F.n8*2;

        for (let p=1; p<power; p++) {
            await generateTruncate(p);
        }

        await fdOld.close();

        return true;

        async function generateTruncate(p) {

            let sP = p.toString();
            while (sP.length<2) sP = "0" + sP;

            if (logger) logger.debug("Writing Power: "+sP);

            const fdNew = await createBinFile(template + sP + ".ptau", "ptau", 1, 11);
            await writePTauHeader(fdNew, curve, p, ceremonyPower);

            await copySection(fdOld, sections, fdNew, 2, ((2 ** p)*2-1) * sG1 ); // tagG1
            await copySection(fdOld, sections, fdNew, 3, (2 ** p) * sG2); // tauG2
            await copySection(fdOld, sections, fdNew, 4, (2 ** p) * sG1); // alfaTauG1
            await copySection(fdOld, sections, fdNew, 5, (2 ** p) * sG1); // betaTauG1
            await copySection(fdOld, sections, fdNew, 6,  sG2); // betaTauG2
            await copySection(fdOld, sections, fdNew, 7); // contributions
            await copySection(fdOld, sections, fdNew, 12, ((2 ** (p+1))*2 -1) * sG1); // L_tauG1
            await copySection(fdOld, sections, fdNew, 13, ((2 ** p)*2 -1) * sG2); // L_tauG2
            await copySection(fdOld, sections, fdNew, 14, ((2 ** p)*2 -1) * sG1); // L_alfaTauG1
            await copySection(fdOld, sections, fdNew, 15, ((2 ** p)*2 -1) * sG1); // L_betaTauG1

            await fdNew.close();
        }


    }

    async function convert(oldPtauFilename, newPTauFilename, logger) {

        const {fd: fdOld, sections} = await readBinFile(oldPtauFilename, "ptau", 1);
        const {curve, power} = await readPTauHeader(fdOld, sections);

        const fdNew = await createBinFile(newPTauFilename, "ptau", 1, 11);
        await writePTauHeader(fdNew, curve, power);

        // const fdTmp = await fastFile.createOverride(newPTauFilename+ ".tmp");

        await copySection(fdOld, sections, fdNew, 2);
        await copySection(fdOld, sections, fdNew, 3);
        await copySection(fdOld, sections, fdNew, 4);
        await copySection(fdOld, sections, fdNew, 5);
        await copySection(fdOld, sections, fdNew, 6);
        await copySection(fdOld, sections, fdNew, 7);

        await processSection(2, 12, "G1", "tauG1" );
        await copySection(fdOld, sections, fdNew, 13);
        await copySection(fdOld, sections, fdNew, 14);
        await copySection(fdOld, sections, fdNew, 15);

        await fdOld.close();
        await fdNew.close();

        // await fs.promises.unlink(newPTauFilename+ ".tmp");

        return;

        async function processSection(oldSectionId, newSectionId, Gstr, sectionName) {
            if (logger) logger.debug("Starting section: "+sectionName);

            await startWriteSection(fdNew, newSectionId);

            const size = sections[newSectionId][0].size;
            const chunkSize = fdOld.pageSize;
            await startReadUniqueSection(fdOld, sections, newSectionId);
            for (let p=0; p<size; p+=chunkSize) {
                const l = Math.min(size -p, chunkSize);
                const buff = await fdOld.read(l);
                await fdNew.write(buff);
            }
            await endReadSection(fdOld);

            if (oldSectionId == 2) {
                await processSectionPower(power+1);
            }

            await endWriteSection(fdNew);

            async function processSectionPower(p) {
                const nPoints = 2 ** p;
                const G = curve[Gstr];
                const sGin = G.F.n8*2;

                let buff;
                buff = new BigBuffer(nPoints*sGin);

                await startReadUniqueSection(fdOld, sections, oldSectionId);
                if ((oldSectionId == 2)&&(p==power+1)) {
                    await fdOld.readToBuffer(buff, 0,(nPoints-1)*sGin );
                    buff.set(curve.G1.zeroAffine, (nPoints-1)*sGin );
                } else {
                    await fdOld.readToBuffer(buff, 0,nPoints*sGin );
                }
                await endReadSection(fdOld, true);

                buff = await G.lagrangeEvaluations(buff, "affine", "affine", logger, sectionName);
                await fdNew.write(buff);

    /*
                if (p <= curve.Fr.s) {
                    buff = await G.ifft(buff, "affine", "affine", logger, sectionName);
                    await fdNew.write(buff);
                } else if (p == curve.Fr.s+1) {
                    const smallM = 1<<curve.Fr.s;
                    let t0 = new BigBuffer( smallM * sGmid );
                    let t1 = new BigBuffer( smallM * sGmid );

                    const shift_to_small_m = Fr.exp(Fr.shift, smallM);
                    const one_over_denom = Fr.inv(Fr.sub(shift_to_small_m, Fr.one));

                    let sInvAcc = Fr.one;
                    for (let i=0; i<smallM; i++) {
                        if (i%10000) logger.debug(`sectionName prepare L calc: ${sectionName}, ${i}/${smallM}`);
                        const ti =  buff.slice(i*sGin, (i+1)*sGin);
                        const tmi = buff.slice((i+smallM)*sGin, (i+smallM+1)*sGin);

                        t0.set(
                            G.timesFr(
                                G.sub(
                                    G.timesFr(ti , shift_to_small_m),
                                    tmi
                                ),
                                one_over_denom
                            ),
                            i*sGmid
                        );
                        t1.set(
                            G.timesFr(
                                G.sub( tmi, ti),
                                Fr.mul(sInvAcc, one_over_denom)
                            ),
                            i*sGmid
                        );


                        sInvAcc = Fr.mul(sInvAcc, Fr.shiftInv);
                    }
                    t0 = await G.ifft(t0, "jacobian", "affine", logger, sectionName + " t0");
                    await fdNew.write(t0);
                    t0 = null;
                    t1 = await G.ifft(t1, "jacobian", "affine", logger, sectionName + " t1");
                    await fdNew.write(t1);

                } else {
                    if (logger) logger.error("Power too big");
                    throw new Error("Power to big");
                }
    */
            }


        }
    }

    async function exportJson(pTauFilename, verbose) {
        const {fd, sections} = await readBinFile(pTauFilename, "ptau", 1);

        const {curve, power} = await readPTauHeader(fd, sections);

        const pTau = {};
        pTau.q = curve.q;
        pTau.power = power;
        pTau.contributions = await readContributions(fd, curve, sections);

        pTau.tauG1 = await exportSection(2, "G1", (2 ** power)*2 -1, "tauG1");
        pTau.tauG2 = await exportSection(3, "G2", (2 ** power), "tauG2");
        pTau.alphaTauG1 = await exportSection(4, "G1", (2 ** power), "alphaTauG1");
        pTau.betaTauG1 = await exportSection(5, "G1", (2 ** power), "betaTauG1");
        pTau.betaG2 = await exportSection(6, "G2", 1, "betaG2");

        pTau.lTauG1 = await exportLagrange(12, "G1", "lTauG1");
        pTau.lTauG2 = await exportLagrange(13, "G2", "lTauG2");
        pTau.lAlphaTauG1 = await exportLagrange(14, "G1", "lAlphaTauG2");
        pTau.lBetaTauG1 = await exportLagrange(15, "G1", "lBetaTauG2");

        await fd.close();

        return pTau;



        async function exportSection(sectionId, groupName, nPoints, sectionName) {
            const G = curve[groupName];
            const sG = G.F.n8*2;

            const res = [];
            await startReadUniqueSection(fd, sections, sectionId);
            for (let i=0; i< nPoints; i++) {
                if ((verbose)&&i&&(i%10000 == 0)) console.log(`${sectionName}: ` + i);
                const buff = await fd.read(sG);
                res.push(G.fromRprLEM(buff, 0));
            }
            await endReadSection(fd);

            return res;
        }

        async function exportLagrange(sectionId, groupName, sectionName) {
            const G = curve[groupName];
            const sG = G.F.n8*2;

            const res = [];
            await startReadUniqueSection(fd, sections, sectionId);
            for (let p=0; p<=power; p++) {
                if (verbose) console.log(`${sectionName}: Power: ${p}`);
                res[p] = [];
                const nPoints = (2 ** p);
                for (let i=0; i<nPoints; i++) {
                    if ((verbose)&&i&&(i%10000 == 0)) console.log(`${sectionName}: ${i}/${nPoints}`);
                    const buff = await fd.read(sG);
                    res[p].push(G.fromRprLEM(buff, 0));
                }
            }
            await endReadSection(fd);
            return res;
        }


    }

    var powersoftau = /*#__PURE__*/Object.freeze({
        __proto__: null,
        newAccumulator: newAccumulator,
        exportChallenge: exportChallenge,
        importResponse: importResponse,
        verify: verify,
        challengeContribute: challengeContribute,
        beacon: beacon,
        contribute: contribute,
        preparePhase2: preparePhase2,
        truncate: truncate,
        convert: convert,
        exportJson: exportJson
    });

    function r1csPrint(r1cs, syms, logger) {
        for (let i=0; i<r1cs.constraints.length; i++) {
            printCostraint(r1cs.constraints[i]);
        }
        function printCostraint(c) {
            const lc2str = (lc) => {
                let S = "";
                const keys = Object.keys(lc);
                keys.forEach( (k) => {
                    let name = syms.varIdx2Name[k];
                    if (name == "one") name = "";

                    let vs = r1cs.curve.Fr.toString(lc[k]);
                    if (vs == "1") vs = "";  // Do not show ones
                    if (vs == "-1") vs = "-";  // Do not show ones
                    if ((S!="")&&(vs[0]!="-")) vs = "+"+vs;
                    if (S!="") vs = " "+vs;
                    S= S + vs   + name;
                });
                return S;
            };
            const S = `[ ${lc2str(c[0])} ] * [ ${lc2str(c[1])} ] - [ ${lc2str(c[2])} ] = 0`;
            if (logger) logger.info(S);
        }

    }

    const SUBARRAY_SIZE = 0x40000;

    const BigArrayHandler = {
        get: function(obj, prop) {
            if (!isNaN(prop)) {
                return obj.getElement(prop);
            } else return obj[prop];
        },
        set: function(obj, prop, value) {
            if (!isNaN(prop)) {
                return obj.setElement(prop, value);
            } else {
                obj[prop] = value;
                return true;
            }
        }
    };

    class _BigArray {
        constructor (initSize) {
            this.length = initSize || 0;
            this.arr = new Array(SUBARRAY_SIZE);

            for (let i=0; i<initSize; i+=SUBARRAY_SIZE) {
                this.arr[i/SUBARRAY_SIZE] = new Array(Math.min(SUBARRAY_SIZE, initSize - i));
            }
            return this;
        }
        push () {
            for (let i=0; i<arguments.length; i++) {
                this.setElement (this.length, arguments[i]);
            }
        }

        slice (f, t) {
            const arr = new Array(t-f);
            for (let i=f; i< t; i++) arr[i-f] = this.getElement(i);
            return arr;
        }
        getElement(idx) {
            idx = parseInt(idx);
            const idx1 = Math.floor(idx / SUBARRAY_SIZE);
            const idx2 = idx % SUBARRAY_SIZE;
            return this.arr[idx1] ? this.arr[idx1][idx2] : undefined;
        }
        setElement(idx, value) {
            idx = parseInt(idx);
            const idx1 = Math.floor(idx / SUBARRAY_SIZE);
            if (!this.arr[idx1]) {
                this.arr[idx1] = new Array(SUBARRAY_SIZE);
            }
            const idx2 = idx % SUBARRAY_SIZE;
            this.arr[idx1][idx2] = value;
            if (idx >= this.length) this.length = idx+1;
            return true;
        }
        getKeys() {
            const newA = new BigArray();
            for (let i=0; i<this.arr.length; i++) {
                if (this.arr[i]) {
                    for (let j=0; j<this.arr[i].length; j++) {
                        if (typeof this.arr[i][j] !== "undefined") {
                            newA.push(i*SUBARRAY_SIZE+j);
                        }
                    }
                }
            }
            return newA;
        }
    }

    class BigArray {
        constructor( initSize ) {
            const obj = new _BigArray(initSize);
            const extObj = new Proxy(obj, BigArrayHandler);
            return extObj;
        }
    }

    async function readR1csHeader(fd,sections,singleThread) {


        const res = {};
        await startReadUniqueSection(fd, sections, 1);
        // Read Header
        res.n8 = await fd.readULE32();
        res.prime = await readBigInt(fd, res.n8);

        res.curve = await getCurveFromR(res.prime, singleThread);

        res.nVars = await fd.readULE32();
        res.nOutputs = await fd.readULE32();
        res.nPubInputs = await fd.readULE32();
        res.nPrvInputs = await fd.readULE32();
        res.nLabels = await fd.readULE64();
        res.nConstraints = await fd.readULE32();
        await endReadSection(fd);

        return res;
    }

    async function readConstraints(fd,sections, r1cs, logger, loggerCtx) {
        const bR1cs = await readSection(fd, sections, 2);
        let bR1csPos = 0;
        let constraints;
        if (r1cs.nConstraints>1<<20) {
            constraints = new BigArray();
        } else {
            constraints = [];
        }
        for (let i=0; i<r1cs.nConstraints; i++) {
            if ((logger)&&(i%100000 == 0)) logger.info(`${loggerCtx}: Loading constraints: ${i}/${r1cs.nConstraints}`);
            const c = readConstraint();
            constraints.push(c);
        }
        return constraints;


        function readConstraint() {
            const c = [];
            c[0] = readLC();
            c[1] = readLC();
            c[2] = readLC();
            return c;
        }

        function readLC() {
            const lc= {};

            const buffUL32 = bR1cs.slice(bR1csPos, bR1csPos+4);
            bR1csPos += 4;
            const buffUL32V = new DataView(buffUL32.buffer);
            const nIdx = buffUL32V.getUint32(0, true);

            const buff = bR1cs.slice(bR1csPos, bR1csPos + (4+r1cs.n8)*nIdx );
            bR1csPos += (4+r1cs.n8)*nIdx;
            const buffV = new DataView(buff.buffer);
            for (let i=0; i<nIdx; i++) {
                const idx = buffV.getUint32(i*(4+r1cs.n8), true);
                const val = r1cs.curve.Fr.fromRprLE(buff, i*(4+r1cs.n8)+4);
                lc[idx] = val;
            }
            return lc;
        }
    }

    async function readMap(fd, sections, r1cs, logger, loggerCtx) {
        const bMap = await readSection(fd, sections, 3);
        let bMapPos = 0;
        let map;

        if (r1cs.nVars>1<<20) {
            map = new BigArray();
        } else {
            map = [];
        }
        for (let i=0; i<r1cs.nVars; i++) {
            if ((logger)&&(i%10000 == 0)) logger.info(`${loggerCtx}: Loading map: ${i}/${r1cs.nVars}`);
            const idx = readULE64();
            map.push(idx);
        }

        return map;

        function readULE64() {
            const buffULE64 = bMap.slice(bMapPos, bMapPos+8);
            bMapPos += 8;
            const buffULE64V = new DataView(buffULE64.buffer);
            const LSB = buffULE64V.getUint32(0, true);
            const MSB = buffULE64V.getUint32(4, true);

            return MSB * 0x100000000 + LSB;
        }

    }

    async function readR1cs(fileName, loadConstraints, loadMap, singleThread, logger, loggerCtx) {

        const {fd, sections} = await readBinFile(fileName, "r1cs", 1);

        const res = await readR1csHeader(fd, sections, singleThread);


        if (loadConstraints) {
            res.constraints = await readConstraints(fd, sections, res, logger, loggerCtx);
        }

        // Read Labels

        if (loadMap) {
            res.map = await readMap(fd, sections, res, logger, loggerCtx);
        }

        await fd.close();

        return res;
    }

    const bls12381r$2 = Scalar$1.e("73eda753299d7d483339d80809a1d80553bda402fffe5bfeffffffff00000001", 16);
    const bn128r$2 = Scalar$1.e("21888242871839275222246405745257275088548364400416034343698204186575808495617");

    async function r1csInfo(r1csName, logger) {

        const cir = await readR1cs(r1csName);

        if (Scalar$1.eq(cir.prime, bn128r$2)) {
            if (logger) logger.info("Curve: bn-128");
        } else if (Scalar$1.eq(cir.prime, bls12381r$2)) {
            if (logger) logger.info("Curve: bls12-381");
        } else {
            if (logger) logger.info(`Unknown Curve. Prime: ${Scalar$1.toString(cir.prime)}`);
        }
        if (logger) logger.info(`# of Wires: ${cir.nVars}`);
        if (logger) logger.info(`# of Constraints: ${cir.nConstraints}`);
        if (logger) logger.info(`# of Private Inputs: ${cir.nPrvInputs}`);
        if (logger) logger.info(`# of Public Inputs: ${cir.nPubInputs}`);
        if (logger) logger.info(`# of Labels: ${cir.nLabels}`);
        if (logger) logger.info(`# of Outputs: ${cir.nOutputs}`);

        return cir;
    }

    function stringifyBigInts$4(Fr, o) {
        if (o instanceof Uint8Array)  {
            return Fr.toString(o);
        } else if (Array.isArray(o)) {
            return o.map(stringifyBigInts$4.bind(null, Fr));
        } else if (typeof o == "object") {
            const res = {};
            const keys = Object.keys(o);
            keys.forEach( (k) => {
                res[k] = stringifyBigInts$4(Fr, o[k]);
            });
            return res;
        } else if ((typeof(o) == "bigint") || o.eq !== undefined)  {
            return o.toString(10);
        } else {
            return o;
        }
    }


    async function r1csExportJson(r1csFileName, logger) {

        const cir = await readR1cs(r1csFileName, true, true, true, logger);
        const Fr=cir.curve.Fr;
        delete cir.curve;

        return stringifyBigInts$4(Fr, cir);
    }

    var r1cs = /*#__PURE__*/Object.freeze({
        __proto__: null,
        print: r1csPrint,
        info: r1csInfo,
        exportJson: r1csExportJson
    });

    async function loadSymbols(symFileName) {
        const sym = {
            labelIdx2Name: [ "one" ],
            varIdx2Name: [ "one" ],
            componentIdx2Name: []
        };
        const fd = await readExisting$2(symFileName);
        const buff = await fd.read(fd.totalSize);
        const symsStr = new TextDecoder("utf-8").decode(buff);
        const lines = symsStr.split("\n");
        for (let i=0; i<lines.length; i++) {
            const arr = lines[i].split(",");
            if (arr.length!=4) continue;
            if (sym.varIdx2Name[arr[1]]) {
                sym.varIdx2Name[arr[1]] += "|" + arr[3];
            } else {
                sym.varIdx2Name[arr[1]] = arr[3];
            }
            sym.labelIdx2Name[arr[0]] = arr[3];
            if (!sym.componentIdx2Name[arr[2]]) {
                sym.componentIdx2Name[arr[2]] = extractComponent(arr[3]);
            }
        }

        await fd.close();

        return sym;

        function extractComponent(name) {
            const arr = name.split(".");
            arr.pop(); // Remove the lasr element
            return arr.join(".");
        }
    }

    async function wtnsDebug(input, wasmFileName, wtnsFileName, symName, options, logger) {

        const fdWasm = await readExisting$2(wasmFileName);
        const wasm = await fdWasm.read(fdWasm.totalSize);
        await fdWasm.close();


        let wcOps = {
            sanityCheck: true
        };
        let sym = await loadSymbols(symName);
        if (options.set) {
            if (!sym) sym = await loadSymbols(symName);
            wcOps.logSetSignal= function(labelIdx, value) {
                if (logger) logger.info("SET " + sym.labelIdx2Name[labelIdx] + " <-- " + value.toString());
            };
        }
        if (options.get) {
            if (!sym) sym = await loadSymbols(symName);
            wcOps.logGetSignal= function(varIdx, value) {
                if (logger) logger.info("GET " + sym.labelIdx2Name[varIdx] + " --> " + value.toString());
            };
        }
        if (options.trigger) {
            if (!sym) sym = await loadSymbols(symName);
            wcOps.logStartComponent= function(cIdx) {
                if (logger) logger.info("START: " + sym.componentIdx2Name[cIdx]);
            };
            wcOps.logFinishComponent= function(cIdx) {
                if (logger) logger.info("FINISH: " + sym.componentIdx2Name[cIdx]);
            };
        }
        wcOps.sym = sym;

        const wc = await builder(wasm, wcOps);
        const w = await wc.calculateWitness(input);

        const fdWtns = await createBinFile(wtnsFileName, "wtns", 2, 2);

        await write(fdWtns, w, wc.prime);

        await fdWtns.close();
    }

    async function wtnsExportJson(wtnsFileName) {

        const w = await read(wtnsFileName);

        return w;
    }

    var wtns = /*#__PURE__*/Object.freeze({
        __proto__: null,
        calculate: wtnsCalculate,
        debug: wtnsDebug,
        exportJson: wtnsExportJson
    });

    const SUBARRAY_SIZE$1 = 0x40000;

    const BigArrayHandler$1 = {
        get: function(obj, prop) {
            if (!isNaN(prop)) {
                return obj.getElement(prop);
            } else return obj[prop];
        },
        set: function(obj, prop, value) {
            if (!isNaN(prop)) {
                return obj.setElement(prop, value);
            } else {
                obj[prop] = value;
                return true;
            }
        }
    };

    class _BigArray$1 {
        constructor (initSize) {
            this.length = initSize || 0;
            this.arr = new Array(SUBARRAY_SIZE$1);

            for (let i=0; i<initSize; i+=SUBARRAY_SIZE$1) {
                this.arr[i/SUBARRAY_SIZE$1] = new Array(Math.min(SUBARRAY_SIZE$1, initSize - i));
            }
            return this;
        }
        push () {
            for (let i=0; i<arguments.length; i++) {
                this.setElement (this.length, arguments[i]);
            }
        }

        slice (f, t) {
            const arr = new Array(t-f);
            for (let i=f; i< t; i++) arr[i-f] = this.getElement(i);
            return arr;
        }
        getElement(idx) {
            idx = parseInt(idx);
            const idx1 = Math.floor(idx / SUBARRAY_SIZE$1);
            const idx2 = idx % SUBARRAY_SIZE$1;
            return this.arr[idx1] ? this.arr[idx1][idx2] : undefined;
        }
        setElement(idx, value) {
            idx = parseInt(idx);
            const idx1 = Math.floor(idx / SUBARRAY_SIZE$1);
            if (!this.arr[idx1]) {
                this.arr[idx1] = new Array(SUBARRAY_SIZE$1);
            }
            const idx2 = idx % SUBARRAY_SIZE$1;
            this.arr[idx1][idx2] = value;
            if (idx >= this.length) this.length = idx+1;
            return true;
        }
        getKeys() {
            const newA = new BigArray$1();
            for (let i=0; i<this.arr.length; i++) {
                if (this.arr[i]) {
                    for (let j=0; j<this.arr[i].length; j++) {
                        if (typeof this.arr[i][j] !== "undefined") {
                            newA.push(i*SUBARRAY_SIZE$1+j);
                        }
                    }
                }
            }
            return newA;
        }
    }

    class BigArray$1 {
        constructor( initSize ) {
            const obj = new _BigArray$1(initSize);
            const extObj = new Proxy(obj, BigArrayHandler$1);
            return extObj;
        }
    }

    async function newZKey(r1csName, ptauName, zkeyName, logger) {

        const TAU_G1 = 0;
        const TAU_G2 = 1;
        const ALPHATAU_G1 = 2;
        const BETATAU_G1 = 3;
        await blake2bWasm.ready();
        const csHasher = blake2bWasm(64);

        const {fd: fdPTau, sections: sectionsPTau} = await readBinFile(ptauName, "ptau", 1);
        const {curve, power} = await readPTauHeader(fdPTau, sectionsPTau);
        const {fd: fdR1cs, sections: sectionsR1cs} = await readBinFile(r1csName, "r1cs", 1);
        const r1cs = await readR1csHeader(fdR1cs, sectionsR1cs, false);

        const fdZKey = await createBinFile(zkeyName, "zkey", 1, 10, 1<<22, 1<<24);

        const sG1 = curve.G1.F.n8*2;
        const sG2 = curve.G2.F.n8*2;

        if (r1cs.prime != curve.r) {
            if (logger) logger.error("r1cs curve does not match powers of tau ceremony curve");
            return -1;
        }

        const cirPower = log2$1(r1cs.nConstraints + r1cs.nPubInputs + r1cs.nOutputs +1 -1) +1;

        if (cirPower > power) {
            if (logger) logger.error(`circuit too big for this power of tau ceremony. ${r1cs.nConstraints}*2 > 2**${power}`);
            return -1;
        }

        if (!sectionsPTau[12]) {
            if (logger) logger.error("Powers of tau is not prepared.");
            return -1;
        }

        const nPublic = r1cs.nOutputs + r1cs.nPubInputs;
        const domainSize = 2 ** cirPower;

        // Write the header
        ///////////
        await startWriteSection(fdZKey, 1);
        await fdZKey.writeULE32(1); // Groth
        await endWriteSection(fdZKey);

        // Write the Groth header section
        ///////////

        await startWriteSection(fdZKey, 2);
        const primeQ = curve.q;
        const n8q = (Math.floor( (Scalar$1.bitLength(primeQ) - 1) / 64) +1)*8;

        const primeR = curve.r;
        const n8r = (Math.floor( (Scalar$1.bitLength(primeR) - 1) / 64) +1)*8;
        const Rr = Scalar$1.mod(Scalar$1.shl(1, n8r*8), primeR);
        const R2r = curve.Fr.e(Scalar$1.mod(Scalar$1.mul(Rr,Rr), primeR));

        await fdZKey.writeULE32(n8q);
        await writeBigInt(fdZKey, primeQ, n8q);
        await fdZKey.writeULE32(n8r);
        await writeBigInt(fdZKey, primeR, n8r);
        await fdZKey.writeULE32(r1cs.nVars);                         // Total number of bars
        await fdZKey.writeULE32(nPublic);                       // Total number of public vars (not including ONE)
        await fdZKey.writeULE32(domainSize);                  // domainSize

        let bAlpha1;
        bAlpha1 = await fdPTau.read(sG1, sectionsPTau[4][0].p);
        await fdZKey.write(bAlpha1);
        bAlpha1 = await curve.G1.batchLEMtoU(bAlpha1);
        csHasher.update(bAlpha1);

        let bBeta1;
        bBeta1 = await fdPTau.read(sG1, sectionsPTau[5][0].p);
        await fdZKey.write(bBeta1);
        bBeta1 = await curve.G1.batchLEMtoU(bBeta1);
        csHasher.update(bBeta1);

        let bBeta2;
        bBeta2 = await fdPTau.read(sG2, sectionsPTau[6][0].p);
        await fdZKey.write(bBeta2);
        bBeta2 = await curve.G2.batchLEMtoU(bBeta2);
        csHasher.update(bBeta2);

        const bg1 = new Uint8Array(sG1);
        curve.G1.toRprLEM(bg1, 0, curve.G1.g);
        const bg2 = new Uint8Array(sG2);
        curve.G2.toRprLEM(bg2, 0, curve.G2.g);
        const bg1U = new Uint8Array(sG1);
        curve.G1.toRprUncompressed(bg1U, 0, curve.G1.g);
        const bg2U = new Uint8Array(sG2);
        curve.G2.toRprUncompressed(bg2U, 0, curve.G2.g);

        await fdZKey.write(bg2);        // gamma2
        await fdZKey.write(bg1);        // delta1
        await fdZKey.write(bg2);        // delta2
        csHasher.update(bg2U);      // gamma2
        csHasher.update(bg1U);      // delta1
        csHasher.update(bg2U);      // delta2
        await endWriteSection(fdZKey);

        if (logger) logger.info("Reading r1cs");
        let sR1cs = await readSection(fdR1cs, sectionsR1cs, 2);

        const A = new BigArray$1(r1cs.nVars);
        const B1 = new BigArray$1(r1cs.nVars);
        const B2 = new BigArray$1(r1cs.nVars);
        const C = new BigArray$1(r1cs.nVars- nPublic -1);
        const IC = new Array(nPublic+1);

        if (logger) logger.info("Reading tauG1");
        let sTauG1 = await readSection(fdPTau, sectionsPTau, 12, (domainSize -1)*sG1, domainSize*sG1);
        if (logger) logger.info("Reading tauG2");
        let sTauG2 = await readSection(fdPTau, sectionsPTau, 13, (domainSize -1)*sG2, domainSize*sG2);
        if (logger) logger.info("Reading alphatauG1");
        let sAlphaTauG1 = await readSection(fdPTau, sectionsPTau, 14, (domainSize -1)*sG1, domainSize*sG1);
        if (logger) logger.info("Reading betatauG1");
        let sBetaTauG1 = await readSection(fdPTau, sectionsPTau, 15, (domainSize -1)*sG1, domainSize*sG1);

        await processConstraints();

        await composeAndWritePoints(3, "G1", IC, "IC");

        await writeHs();

        await hashHPoints();

        await composeAndWritePoints(8, "G1", C, "C");
        await composeAndWritePoints(5, "G1", A, "A");
        await composeAndWritePoints(6, "G1", B1, "B1");
        await composeAndWritePoints(7, "G2", B2, "B2");

        const csHash = csHasher.digest();
        // Contributions section
        await startWriteSection(fdZKey, 10);
        await fdZKey.write(csHash);
        await fdZKey.writeULE32(0);
        await endWriteSection(fdZKey);

        if (logger) logger.info(formatHash(csHash, "Circuit hash: "));


        await fdZKey.close();
        await fdR1cs.close();
        await fdPTau.close();

        return csHash;

        async function writeHs() {
            await startWriteSection(fdZKey, 9);
            const buffOut = new BigBuffer(domainSize*sG1);
            if (cirPower < curve.Fr.s) {
                let sTauG1 = await readSection(fdPTau, sectionsPTau, 12, (domainSize*2-1)*sG1, domainSize*2*sG1);
                for (let i=0; i< domainSize; i++) {
                    if ((logger)&&(i%10000 == 0)) logger.debug(`spliting buffer: ${i}/${domainSize}`);
                    const buff = sTauG1.slice( (i*2+1)*sG1, (i*2+1)*sG1 + sG1 );
                    buffOut.set(buff, i*sG1);
                }
            } else if (cirPower == curve.Fr.s) {
                const o = sectionsPTau[12][0].p + ((2 ** (cirPower+1)) -1)*sG1;
                await fdPTau.readToBuffer(buffOut, 0, domainSize*sG1, o + domainSize*sG1);
            } else {
                if (logger) logger.error("Circuit too big");
                throw new Error("Circuit too big for this curve");
            }
            await fdZKey.write(buffOut);
            await endWriteSection(fdZKey);
        }

        async function processConstraints() {
            const buffCoeff = new Uint8Array(12 + curve.Fr.n8);
            const buffCoeffV = new DataView(buffCoeff.buffer);
            const bOne = new Uint8Array(curve.Fr.n8);
            curve.Fr.toRprLE(bOne, 0, curve.Fr.e(1));

            let r1csPos = 0;

            function r1cs_readULE32() {
                const buff = sR1cs.slice(r1csPos, r1csPos+4);
                r1csPos += 4;
                const buffV = new DataView(buff.buffer);
                return buffV.getUint32(0, true);
            }

            const coefs = new BigArray$1();
            for (let c=0; c<r1cs.nConstraints; c++) {
                if ((logger)&&(c%10000 == 0)) logger.debug(`processing constraints: ${c}/${r1cs.nConstraints}`);
                const nA = r1cs_readULE32();
                for (let i=0; i<nA; i++) {
                    const s = r1cs_readULE32();
                    const coefp = r1csPos;
                    r1csPos += curve.Fr.n8;

                    const l1t = TAU_G1;
                    const l1 = sG1*c;
                    const l2t = BETATAU_G1;
                    const l2 = sG1*c;
                    if (typeof A[s] === "undefined") A[s] = [];
                    A[s].push([l1t, l1, coefp]);

                    if (s <= nPublic) {
                        if (typeof IC[s] === "undefined") IC[s] = [];
                        IC[s].push([l2t, l2, coefp]);
                    } else {
                        if (typeof C[s- nPublic -1] === "undefined") C[s- nPublic -1] = [];
                        C[s - nPublic -1].push([l2t, l2, coefp]);
                    }
                    coefs.push([0, c, s, coefp]);
                }

                const nB = r1cs_readULE32();
                for (let i=0; i<nB; i++) {
                    const s = r1cs_readULE32();
                    const coefp = r1csPos;
                    r1csPos += curve.Fr.n8;

                    const l1t = TAU_G1;
                    const l1 = sG1*c;
                    const l2t = TAU_G2;
                    const l2 = sG2*c;
                    const l3t = ALPHATAU_G1;
                    const l3 = sG1*c;
                    if (typeof B1[s] === "undefined") B1[s] = [];
                    B1[s].push([l1t, l1, coefp]);
                    if (typeof B2[s] === "undefined") B2[s] = [];
                    B2[s].push([l2t, l2, coefp]);

                    if (s <= nPublic) {
                        if (typeof IC[s] === "undefined") IC[s] = [];
                        IC[s].push([l3t, l3, coefp]);
                    } else {
                        if (typeof C[s- nPublic -1] === "undefined") C[s- nPublic -1] = [];
                        C[s- nPublic -1].push([l3t, l3, coefp]);
                    }

                    coefs.push([1, c, s, coefp]);
                }

                const nC = r1cs_readULE32();
                for (let i=0; i<nC; i++) {
                    const s = r1cs_readULE32();
                    const coefp = r1csPos;
                    r1csPos += curve.Fr.n8;

                    const l1t = TAU_G1;
                    const l1 = sG1*c;
                    if (s <= nPublic) {
                        if (typeof IC[s] === "undefined") IC[s] = [];
                        IC[s].push([l1t, l1, coefp]);
                    } else {
                        if (typeof C[s- nPublic -1] === "undefined") C[s- nPublic -1] = [];
                        C[s- nPublic -1].push([l1t, l1, coefp]);
                    }
                }
            }

            for (let s = 0; s <= nPublic ; s++) {
                const l1t = TAU_G1;
                const l1 = sG1*(r1cs.nConstraints + s);
                const l2t = BETATAU_G1;
                const l2 = sG1*(r1cs.nConstraints + s);
                if (typeof A[s] === "undefined") A[s] = [];
                A[s].push([l1t, l1, -1]);
                if (typeof IC[s] === "undefined") IC[s] = [];
                IC[s].push([l2t, l2, -1]);
                coefs.push([0, r1cs.nConstraints + s, s, -1]);
            }


            await startWriteSection(fdZKey, 4);

            const buffSection = new BigBuffer(coefs.length*(12+curve.Fr.n8) + 4);

            const buff4 = new Uint8Array(4);
            const buff4V = new DataView(buff4.buffer);
            buff4V.setUint32(0, coefs.length, true);
            buffSection.set(buff4);
            let coefsPos = 4;
            for (let i=0; i<coefs.length; i++) {
                if ((logger)&&(i%100000 == 0)) logger.debug(`writing coeffs: ${i}/${coefs.length}`);
                writeCoef(coefs[i]);
            }

            await fdZKey.write(buffSection);
            await endWriteSection(fdZKey);

            function writeCoef(c) {
                buffCoeffV.setUint32(0, c[0], true);
                buffCoeffV.setUint32(4, c[1], true);
                buffCoeffV.setUint32(8, c[2], true);
                let n;
                if (c[3]>=0) {
                    n = curve.Fr.fromRprLE(sR1cs.slice(c[3], c[3] + curve.Fr.n8), 0);
                } else {
                    n = curve.Fr.fromRprLE(bOne, 0);
                }
                const nR2 = curve.Fr.mul(n, R2r);
                curve.Fr.toRprLE(buffCoeff, 12, nR2);
                buffSection.set(buffCoeff, coefsPos);
                coefsPos += buffCoeff.length;
            }

        }

        async function composeAndWritePoints(idSection, groupName, arr, sectionName) {
            const CHUNK_SIZE= 1<<15;
            const G = curve[groupName];

            hashU32(arr.length);
            await startWriteSection(fdZKey, idSection);

            let opPromises = [];

            let i=0;
            while (i<arr.length) {

                let t=0;
                while ((i<arr.length)&&(t<curve.tm.concurrency)) {
                    if (logger)  logger.debug(`Writing points start ${sectionName}: ${i}/${arr.length}`);
                    let n = 1;
                    let nP = (arr[i] ? arr[i].length : 0);
                    while ((i + n < arr.length) && (nP + (arr[i+n] ? arr[i+n].length : 0) < CHUNK_SIZE) && (n<CHUNK_SIZE)) {
                        nP += (arr[i+n] ? arr[i+n].length : 0);
                        n ++;
                    }
                    const subArr = arr.slice(i, i + n);
                    const _i = i;
                    opPromises.push(composeAndWritePointsThread(groupName, subArr, logger, sectionName).then( (r) => {
                        if (logger)  logger.debug(`Writing points end ${sectionName}: ${_i}/${arr.length}`);
                        return r;
                    }));
                    i += n;
                    t++;
                }

                const result = await Promise.all(opPromises);

                for (let k=0; k<result.length; k++) {
                    await fdZKey.write(result[k][0]);
                    const buff = await G.batchLEMtoU(result[k][0]);
                    csHasher.update(buff);
                }
                opPromises = [];

            }
            await endWriteSection(fdZKey);

        }

        async function composeAndWritePointsThread(groupName, arr, logger, sectionName) {
            const G = curve[groupName];
            const sGin = G.F.n8*2;
            const sGmid = G.F.n8*3;
            const sGout = G.F.n8*2;
            let fnExp, fnMultiExp, fnBatchToAffine, fnZero;
            if (groupName == "G1") {
                fnExp = "g1m_timesScalarAffine";
                fnMultiExp = "g1m_multiexpAffine";
                fnBatchToAffine = "g1m_batchToAffine";
                fnZero = "g1m_zero";
            } else if (groupName == "G2") {
                fnExp = "g2m_timesScalarAffine";
                fnMultiExp = "g2m_multiexpAffine";
                fnBatchToAffine = "g2m_batchToAffine";
                fnZero = "g2m_zero";
            } else {
                throw new Error("Invalid group");
            }
            let acc =0;
            for (let i=0; i<arr.length; i++) acc += arr[i] ? arr[i].length : 0;
            let bBases, bScalars;
            if (acc> 2<<14) {
                bBases = new BigBuffer(acc*sGin);
                bScalars = new BigBuffer(acc*curve.Fr.n8);
            } else {
                bBases = new Uint8Array(acc*sGin);
                bScalars = new Uint8Array(acc*curve.Fr.n8);
            }
            let pB =0;
            let pS =0;

            const sBuffs = [
                sTauG1,
                sTauG2,
                sAlphaTauG1,
                sBetaTauG1
            ];

            const bOne = new Uint8Array(curve.Fr.n8);
            curve.Fr.toRprLE(bOne, 0, curve.Fr.e(1));

            let offset = 0;
            for (let i=0; i<arr.length; i++) {
                if (!arr[i]) continue;
                for (let j=0; j<arr[i].length; j++) {
                    if ((logger)&&(j)&&(j%10000 == 0))  logger.debug(`Configuring big array ${sectionName}: ${j}/${arr[i].length}`);
                    bBases.set(
                        sBuffs[arr[i][j][0]].slice(
                            arr[i][j][1],
                            arr[i][j][1] + sGin
                        ), offset*sGin
                    );
                    if (arr[i][j][2]>=0) {
                        bScalars.set(
                            sR1cs.slice(
                                arr[i][j][2],
                                arr[i][j][2] + curve.Fr.n8
                            ),
                            offset*curve.Fr.n8
                        );
                    } else {
                        bScalars.set(bOne, offset*curve.Fr.n8);
                    }
                    offset ++;
                }
            }

            if (arr.length>1) {
                const task = [];
                task.push({cmd: "ALLOCSET", var: 0, buff: bBases});
                task.push({cmd: "ALLOCSET", var: 1, buff: bScalars});
                task.push({cmd: "ALLOC", var: 2, len: arr.length*sGmid});
                pB = 0;
                pS = 0;
                let pD =0;
                for (let i=0; i<arr.length; i++) {
                    if (!arr[i]) {
                        task.push({cmd: "CALL", fnName: fnZero, params: [
                            {var: 2, offset: pD}
                        ]});
                        pD += sGmid;
                        continue;
                    }
                    if (arr[i].length == 1) {
                        task.push({cmd: "CALL", fnName: fnExp, params: [
                            {var: 0, offset: pB},
                            {var: 1, offset: pS},
                            {val: curve.Fr.n8},
                            {var: 2, offset: pD}
                        ]});
                    } else {
                        task.push({cmd: "CALL", fnName: fnMultiExp, params: [
                            {var: 0, offset: pB},
                            {var: 1, offset: pS},
                            {val: curve.Fr.n8},
                            {val: arr[i].length},
                            {var: 2, offset: pD}
                        ]});
                    }
                    pB += sGin*arr[i].length;
                    pS += curve.Fr.n8*arr[i].length;
                    pD += sGmid;
                }
                task.push({cmd: "CALL", fnName: fnBatchToAffine, params: [
                    {var: 2},
                    {val: arr.length},
                    {var: 2},
                ]});
                task.push({cmd: "GET", out: 0, var: 2, len: arr.length*sGout});

                const res = await curve.tm.queueAction(task);
                return res;
            } else {
                let res = await G.multiExpAffine(bBases, bScalars, logger, sectionName);
                res = [ G.toAffine(res) ];
                return res;
            }
        }


        async function hashHPoints() {
            const CHUNK_SIZE = 1<<14;

            hashU32(domainSize-1);

            for (let i=0; i<domainSize-1; i+= CHUNK_SIZE) {
                if (logger)  logger.debug(`HashingHPoints: ${i}/${domainSize}`);
                const n = Math.min(domainSize-1, CHUNK_SIZE);
                await hashHPointsChunk(i, n);
            }
        }

        async function hashHPointsChunk(offset, nPoints) {
            const buff1 = await fdPTau.read(nPoints *sG1, sectionsPTau[2][0].p + (offset + domainSize)*sG1);
            const buff2 = await fdPTau.read(nPoints *sG1, sectionsPTau[2][0].p + offset*sG1);
            const concurrency= curve.tm.concurrency;
            const nPointsPerThread = Math.floor(nPoints / concurrency);
            const opPromises = [];
            for (let i=0; i<concurrency; i++) {
                let n;
                if (i< concurrency-1) {
                    n = nPointsPerThread;
                } else {
                    n = nPoints - i*nPointsPerThread;
                }
                if (n==0) continue;

                const subBuff1 = buff1.slice(i*nPointsPerThread*sG1, (i*nPointsPerThread+n)*sG1);
                const subBuff2 = buff2.slice(i*nPointsPerThread*sG1, (i*nPointsPerThread+n)*sG1);
                opPromises.push(hashHPointsThread(subBuff1, subBuff2));
            }


            const result = await Promise.all(opPromises);

            for (let i=0; i<result.length; i++) {
                csHasher.update(result[i][0]);
            }
        }

        async function hashHPointsThread(buff1, buff2) {
            const nPoints = buff1.byteLength/sG1;
            const sGmid = curve.G1.F.n8*3;
            const task = [];
            task.push({cmd: "ALLOCSET", var: 0, buff: buff1});
            task.push({cmd: "ALLOCSET", var: 1, buff: buff2});
            task.push({cmd: "ALLOC", var: 2, len: nPoints*sGmid});
            for (let i=0; i<nPoints; i++) {
                task.push({
                    cmd: "CALL",
                    fnName: "g1m_subAffine",
                    params: [
                        {var: 0, offset: i*sG1},
                        {var: 1, offset: i*sG1},
                        {var: 2, offset: i*sGmid},
                    ]
                });
            }
            task.push({cmd: "CALL", fnName: "g1m_batchToAffine", params: [
                {var: 2},
                {val: nPoints},
                {var: 2},
            ]});
            task.push({cmd: "CALL", fnName: "g1m_batchLEMtoU", params: [
                {var: 2},
                {val: nPoints},
                {var: 2},
            ]});
            task.push({cmd: "GET", out: 0, var: 2, len: nPoints*sG1});

            const res = await curve.tm.queueAction(task);

            return res;
        }

        function hashU32(n) {
            const buff = new Uint8Array(4);
            const buffV = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
            buffV.setUint32(0, n, false);
            csHasher.update(buff);
        }

    }

    async function phase2exportMPCParams(zkeyName, mpcparamsName, logger) {

        const {fd: fdZKey, sections: sectionsZKey} = await readBinFile(zkeyName, "zkey", 2);
        const zkey = await readHeader(fdZKey, sectionsZKey, "groth16");

        const curve = await getCurveFromQ(zkey.q);
        const sG1 = curve.G1.F.n8*2;
        const sG2 = curve.G2.F.n8*2;

        const mpcParams = await readMPCParams(fdZKey, curve, sectionsZKey);

        const fdMPCParams = await createOverride(mpcparamsName);

        /////////////////////
        // Verification Key Section
        /////////////////////
        await writeG1(zkey.vk_alpha_1);
        await writeG1(zkey.vk_beta_1);
        await writeG2(zkey.vk_beta_2);
        await writeG2(zkey.vk_gamma_2);
        await writeG1(zkey.vk_delta_1);
        await writeG2(zkey.vk_delta_2);

        // IC
        let buffBasesIC;
        buffBasesIC = await readSection(fdZKey, sectionsZKey, 3);
        buffBasesIC = await curve.G1.batchLEMtoU(buffBasesIC);

        await writePointArray("G1", buffBasesIC);

        /////////////////////
        // h Section
        /////////////////////
        const buffBasesH_Lodd = await readSection(fdZKey, sectionsZKey, 9);

        let buffBasesH_Tau;
        buffBasesH_Tau = await curve.G1.fft(buffBasesH_Lodd, "affine", "jacobian", logger);
        buffBasesH_Tau = await curve.G1.batchApplyKey(buffBasesH_Tau, curve.Fr.neg(curve.Fr.e(2)), curve.Fr.w[zkey.power+1], "jacobian", "affine", logger);

        // Remove last element.  (The degree of H will be allways m-2)
        buffBasesH_Tau = buffBasesH_Tau.slice(0, buffBasesH_Tau.byteLength - sG1);
        buffBasesH_Tau = await curve.G1.batchLEMtoU(buffBasesH_Tau);
        await writePointArray("G1", buffBasesH_Tau);

        /////////////////////
        // L section
        /////////////////////
        let buffBasesC;
        buffBasesC = await readSection(fdZKey, sectionsZKey, 8);
        buffBasesC = await curve.G1.batchLEMtoU(buffBasesC);
        await writePointArray("G1", buffBasesC);

        /////////////////////
        // A Section (C section)
        /////////////////////
        let buffBasesA;
        buffBasesA = await readSection(fdZKey, sectionsZKey, 5);
        buffBasesA = await curve.G1.batchLEMtoU(buffBasesA);
        await writePointArray("G1", buffBasesA);

        /////////////////////
        // B1 Section
        /////////////////////
        let buffBasesB1;
        buffBasesB1 = await readSection(fdZKey, sectionsZKey, 6);
        buffBasesB1 = await curve.G1.batchLEMtoU(buffBasesB1);
        await writePointArray("G1", buffBasesB1);

        /////////////////////
        // B2 Section
        /////////////////////
        let buffBasesB2;
        buffBasesB2 = await readSection(fdZKey, sectionsZKey, 7);
        buffBasesB2 = await curve.G2.batchLEMtoU(buffBasesB2);
        await writePointArray("G2", buffBasesB2);

        await fdMPCParams.write(mpcParams.csHash);
        await writeU32(mpcParams.contributions.length);

        for (let i=0; i<mpcParams.contributions.length; i++) {
            const c = mpcParams.contributions[i];
            await writeG1(c.deltaAfter);
            await writeG1(c.delta.g1_s);
            await writeG1(c.delta.g1_sx);
            await writeG2(c.delta.g2_spx);
            await fdMPCParams.write(c.transcript);
        }

        await fdZKey.close();
        await fdMPCParams.close();

        async function writeG1(P) {
            const buff = new Uint8Array(sG1);
            curve.G1.toRprUncompressed(buff, 0, P);
            await fdMPCParams.write(buff);
        }

        async function writeG2(P) {
            const buff = new Uint8Array(sG2);
            curve.G2.toRprUncompressed(buff, 0, P);
            await fdMPCParams.write(buff);
        }

        async function writePointArray(groupName, buff) {
            let sG;
            if (groupName == "G1") {
                sG = sG1;
            } else {
                sG = sG2;
            }

            const buffSize = new Uint8Array(4);
            const buffSizeV = new DataView(buffSize.buffer, buffSize.byteOffset, buffSize.byteLength);
            buffSizeV.setUint32(0, buff.byteLength / sG, false);

            await fdMPCParams.write(buffSize);
            await fdMPCParams.write(buff);
        }

        async function writeU32(n) {
            const buffSize = new Uint8Array(4);
            const buffSizeV = new DataView(buffSize.buffer, buffSize.byteOffset, buffSize.byteLength);
            buffSizeV.setUint32(0, n, false);

            await fdMPCParams.write(buffSize);
        }



    }

    async function phase2importMPCParams(zkeyNameOld, mpcparamsName, zkeyNameNew, name, logger) {

        const {fd: fdZKeyOld, sections: sectionsZKeyOld} = await readBinFile(zkeyNameOld, "zkey", 2);
        const zkeyHeader = await readHeader(fdZKeyOld, sectionsZKeyOld, "groth16");

        const curve = await getCurveFromQ(zkeyHeader.q);
        const sG1 = curve.G1.F.n8*2;
        const sG2 = curve.G2.F.n8*2;

        const oldMPCParams = await readMPCParams(fdZKeyOld, curve, sectionsZKeyOld);
        const newMPCParams = {};

        const fdMPCParams = await readExisting$2(mpcparamsName);

        fdMPCParams.pos =
            sG1*3 + sG2*3 +                     // vKey
            8 + sG1*zkeyHeader.nVars +              // IC + C
            4 + sG1*(zkeyHeader.domainSize-1) +     // H
            4 + sG1*zkeyHeader.nVars +              // A
            4 + sG1*zkeyHeader.nVars +              // B1
            4 + sG2*zkeyHeader.nVars;               // B2

        // csHash
        newMPCParams.csHash =  await fdMPCParams.read(64);

        const nConttributions = await fdMPCParams.readUBE32();
        newMPCParams.contributions = [];
        for (let i=0; i<nConttributions; i++) {
            const c = { delta:{} };
            c.deltaAfter = await readG1(fdMPCParams);
            c.delta.g1_s = await readG1(fdMPCParams);
            c.delta.g1_sx = await readG1(fdMPCParams);
            c.delta.g2_spx = await readG2(fdMPCParams);
            c.transcript = await fdMPCParams.read(64);
            if (i<oldMPCParams.contributions.length) {
                c.type = oldMPCParams.contributions[i].type;
                if (c.type==1) {
                    c.beaconHash = oldMPCParams.contributions[i].beaconHash;
                    c.numIterationsExp = oldMPCParams.contributions[i].numIterationsExp;
                }
                if (oldMPCParams.contributions[i].name) {
                    c.name = oldMPCParams.contributions[i].name;
                }
            }
            newMPCParams.contributions.push(c);
        }

        if (!hashIsEqual(newMPCParams.csHash, oldMPCParams.csHash)) {
            if (logger) logger.error("Hash of the original circuit does not match with the MPC one");
            return false;
        }

        if (oldMPCParams.contributions.length > newMPCParams.contributions.length) {
            if (logger) logger.error("The impoerted file does not include new contributions");
            return false;
        }

        for (let i=0; i<oldMPCParams.contributions.length; i++) {
            if (!contributionIsEqual(oldMPCParams.contributions[i], newMPCParams.contributions[i])) {
                if (logger) logger.error(`Previos contribution ${i} does not match`);
                return false;
            }
        }


        // Set the same name to all new controbutions
        if (name) {
            for (let i=oldMPCParams.contributions.length; i<newMPCParams.contributions.length; i++) {
                newMPCParams.contributions[i].name = name;
            }
        }

        const fdZKeyNew = await createBinFile(zkeyNameNew, "zkey", 1, 10);
        fdMPCParams.pos = 0;

        // Header
        fdMPCParams.pos += sG1;  // ignore alpha1 (keep original)
        fdMPCParams.pos += sG1;  // ignore beta1
        fdMPCParams.pos += sG2;  // ignore beta2
        fdMPCParams.pos += sG2;  // ignore gamma2
        zkeyHeader.vk_delta_1 = await readG1(fdMPCParams);
        zkeyHeader.vk_delta_2 = await readG2(fdMPCParams);
        await writeHeader(fdZKeyNew, zkeyHeader);

        // IC (Keep original)
        const nIC = await fdMPCParams.readUBE32();
        if (nIC != zkeyHeader.nPublic +1) {
            if (logger) logger.error("Invalid number of points in IC");
            await fdZKeyNew.discard();
            return false;
        }
        fdMPCParams.pos += sG1*(zkeyHeader.nPublic+1);
        await copySection(fdZKeyOld, sectionsZKeyOld, fdZKeyNew, 3);

        // Coeffs (Keep original)
        await copySection(fdZKeyOld, sectionsZKeyOld, fdZKeyNew, 4);

        // H Section
        const nH = await fdMPCParams.readUBE32();
        if (nH != zkeyHeader.domainSize-1) {
            if (logger) logger.error("Invalid number of points in H");
            await fdZKeyNew.discard();
            return false;
        }
        let buffH;
        const buffTauU = await fdMPCParams.read(sG1*(zkeyHeader.domainSize-1));
        const buffTauLEM = await curve.G1.batchUtoLEM(buffTauU);
        buffH = new Uint8Array(zkeyHeader.domainSize*sG1);
        buffH.set(buffTauLEM);   // Let the last one to zero.
        curve.G1.toRprLEM(buffH, sG1*(zkeyHeader.domainSize-1), curve.G1.zeroAffine);
        const n2Inv = curve.Fr.neg(curve.Fr.inv(curve.Fr.e(2)));
        const wInv = curve.Fr.inv(curve.Fr.w[zkeyHeader.power+1]);
        buffH = await curve.G1.batchApplyKey(buffH, n2Inv, wInv, "affine", "jacobian", logger);
        buffH = await curve.G1.ifft(buffH, "jacobian", "affine", logger);
        await startWriteSection(fdZKeyNew, 9);
        await fdZKeyNew.write(buffH);
        await endWriteSection(fdZKeyNew);

        // C Secion (L section)
        const nL = await fdMPCParams.readUBE32();
        if (nL != (zkeyHeader.nVars-zkeyHeader.nPublic-1)) {
            if (logger) logger.error("Invalid number of points in L");
            await fdZKeyNew.discard();
            return false;
        }
        let buffL;
        buffL = await fdMPCParams.read(sG1*(zkeyHeader.nVars-zkeyHeader.nPublic-1));
        buffL = await curve.G1.batchUtoLEM(buffL);
        await startWriteSection(fdZKeyNew, 8);
        await fdZKeyNew.write(buffL);
        await endWriteSection(fdZKeyNew);

        // A Section
        const nA = await fdMPCParams.readUBE32();
        if (nA != zkeyHeader.nVars) {
            if (logger) logger.error("Invalid number of points in A");
            await fdZKeyNew.discard();
            return false;
        }
        fdMPCParams.pos += sG1*(zkeyHeader.nVars);
        await copySection(fdZKeyOld, sectionsZKeyOld, fdZKeyNew, 5);

        // B1 Section
        const nB1 = await fdMPCParams.readUBE32();
        if (nB1 != zkeyHeader.nVars) {
            if (logger) logger.error("Invalid number of points in B1");
            await fdZKeyNew.discard();
            return false;
        }
        fdMPCParams.pos += sG1*(zkeyHeader.nVars);
        await copySection(fdZKeyOld, sectionsZKeyOld, fdZKeyNew, 6);

        // B2 Section
        const nB2 = await fdMPCParams.readUBE32();
        if (nB2 != zkeyHeader.nVars) {
            if (logger) logger.error("Invalid number of points in B2");
            await fdZKeyNew.discard();
            return false;
        }
        fdMPCParams.pos += sG2*(zkeyHeader.nVars);
        await copySection(fdZKeyOld, sectionsZKeyOld, fdZKeyNew, 7);

        await writeMPCParams(fdZKeyNew, curve, newMPCParams);

        await fdMPCParams.close();
        await fdZKeyNew.close();
        await fdZKeyOld.close();

        return true;

        async function readG1(fd) {
            const buff = await fd.read(curve.G1.F.n8*2);
            return curve.G1.fromRprUncompressed(buff, 0);
        }

        async function readG2(fd) {
            const buff = await fd.read(curve.G2.F.n8*2);
            return curve.G2.fromRprUncompressed(buff, 0);
        }


        function contributionIsEqual(c1, c2) {
            if (!curve.G1.eq(c1.deltaAfter   , c2.deltaAfter)) return false;
            if (!curve.G1.eq(c1.delta.g1_s   , c2.delta.g1_s)) return false;
            if (!curve.G1.eq(c1.delta.g1_sx  , c2.delta.g1_sx)) return false;
            if (!curve.G2.eq(c1.delta.g2_spx , c2.delta.g2_spx)) return false;
            if (!hashIsEqual(c1.transcript, c2.transcript)) return false;
            return true;
        }


    }

    const sameRatio$2 = sameRatio;



    async function phase2verifyFromInit(initFileName, pTauFileName, zkeyFileName, logger) {

        let sr;
        await blake2bWasm.ready();

        const {fd, sections} = await readBinFile(zkeyFileName, "zkey", 2);
        const zkey = await readHeader(fd, sections, "groth16");

        const curve = await getCurveFromQ(zkey.q);
        const sG1 = curve.G1.F.n8*2;
        const sG2 = curve.G2.F.n8*2;

        const mpcParams = await readMPCParams(fd, curve, sections);

        const accumulatedHasher = blake2bWasm(64);
        accumulatedHasher.update(mpcParams.csHash);
        let curDelta = curve.G1.g;
        for (let i=0; i<mpcParams.contributions.length; i++) {
            const c = mpcParams.contributions[i];
            const ourHasher = cloneHasher(accumulatedHasher);

            hashG1(ourHasher, curve, c.delta.g1_s);
            hashG1(ourHasher, curve, c.delta.g1_sx);

            if (!hashIsEqual(ourHasher.digest(), c.transcript)) {
                console.log(`INVALID(${i}): Inconsistent transcript `);
                return false;
            }

            const delta_g2_sp = hashToG2(curve, c.transcript);

            sr = await sameRatio$2(curve, c.delta.g1_s, c.delta.g1_sx, delta_g2_sp, c.delta.g2_spx);
            if (sr !== true) {
                console.log(`INVALID(${i}): public key G1 and G2 do not have the same ration `);
                return false;
            }

            sr = await sameRatio$2(curve, curDelta, c.deltaAfter, delta_g2_sp, c.delta.g2_spx);
            if (sr !== true) {
                console.log(`INVALID(${i}): deltaAfter does not fillow the public key `);
                return false;
            }

            if (c.type == 1) {
                const rng = rngFromBeaconParams(c.beaconHash, c.numIterationsExp);
                const expected_prvKey = curve.Fr.fromRng(rng);
                const expected_g1_s = curve.G1.toAffine(curve.G1.fromRng(rng));
                const expected_g1_sx = curve.G1.toAffine(curve.G1.timesFr(expected_g1_s, expected_prvKey));
                if (curve.G1.eq(expected_g1_s, c.delta.g1_s) !== true) {
                    console.log(`INVALID(${i}): Key of the beacon does not match. g1_s `);
                    return false;
                }
                if (curve.G1.eq(expected_g1_sx, c.delta.g1_sx) !== true) {
                    console.log(`INVALID(${i}): Key of the beacon does not match. g1_sx `);
                    return false;
                }
            }

            hashPubKey(accumulatedHasher, curve, c);

            const contributionHasher = blake2bWasm(64);
            hashPubKey(contributionHasher, curve, c);

            c.contributionHash = contributionHasher.digest();

            curDelta = c.deltaAfter;
        }


        const {fd: fdInit, sections: sectionsInit} = await readBinFile(initFileName, "zkey", 2);
        const zkeyInit = await readHeader(fdInit, sectionsInit, "groth16");

        if (  (!Scalar$1.eq(zkeyInit.q, zkey.q))
            ||(!Scalar$1.eq(zkeyInit.r, zkey.r))
            ||(zkeyInit.n8q != zkey.n8q)
            ||(zkeyInit.n8r != zkey.n8r))
        {
            if (logger) logger.error("INVALID:  Different curves");
            return false;
        }

        if (  (zkeyInit.nVars != zkey.nVars)
            ||(zkeyInit.nPublic !=  zkey.nPublic)
            ||(zkeyInit.domainSize != zkey.domainSize))
        {
            if (logger) logger.error("INVALID:  Different circuit parameters");
            return false;
        }

        if (!curve.G1.eq(zkey.vk_alpha_1, zkeyInit.vk_alpha_1)) {
            if (logger) logger.error("INVALID:  Invalid alpha1");
            return false;
        }
        if (!curve.G1.eq(zkey.vk_beta_1, zkeyInit.vk_beta_1)) {
            if (logger) logger.error("INVALID:  Invalid beta1");
            return false;
        }
        if (!curve.G2.eq(zkey.vk_beta_2, zkeyInit.vk_beta_2)) {
            if (logger) logger.error("INVALID:  Invalid beta2");
            return false;
        }
        if (!curve.G2.eq(zkey.vk_gamma_2, zkeyInit.vk_gamma_2)) {
            if (logger) logger.error("INVALID:  Invalid gamma2");
            return false;
        }
        if (!curve.G1.eq(zkey.vk_delta_1, curDelta)) {
            if (logger) logger.error("INVALID:  Invalid delta1");
            return false;
        }
        sr = await sameRatio$2(curve, curve.G1.g, curDelta, curve.G2.g, zkey.vk_delta_2);
        if (sr !== true) {
            if (logger) logger.error("INVALID:  Invalid delta2");
            return false;
        }

        const mpcParamsInit = await readMPCParams(fdInit, curve, sectionsInit);
        if (!hashIsEqual(mpcParams.csHash, mpcParamsInit.csHash)) {
            if (logger) logger.error("INVALID:  Circuit does not match");
            return false;
        }

        // Check sizes of sections
        if (sections[8][0].size != sG1*(zkey.nVars-zkey.nPublic-1)) {
            if (logger) logger.error("INVALID:  Invalid L section size");
            return false;
        }

        if (sections[9][0].size != sG1*(zkey.domainSize)) {
            if (logger) logger.error("INVALID:  Invalid H section size");
            return false;
        }

        let ss;
        ss = await sectionIsEqual(fd, sections, fdInit, sectionsInit, 3);
        if (!ss) {
            if (logger) logger.error("INVALID:  IC section is not identical");
            return false;
        }

        ss = await sectionIsEqual(fd, sections, fdInit, sectionsInit, 4);
        if (!ss) {
            if (logger) logger.error("Coeffs section is not identical");
            return false;
        }

        ss = await sectionIsEqual(fd, sections, fdInit, sectionsInit, 5);
        if (!ss) {
            if (logger) logger.error("A section is not identical");
            return false;
        }

        ss = await sectionIsEqual(fd, sections, fdInit, sectionsInit, 6);
        if (!ss) {
            if (logger) logger.error("B1 section is not identical");
            return false;
        }

        ss = await sectionIsEqual(fd, sections, fdInit, sectionsInit, 7);
        if (!ss) {
            if (logger) logger.error("B2 section is not identical");
            return false;
        }

        // Check L
        sr = await sectionHasSameRatio("G1", fdInit, sectionsInit, fd, sections, 8, zkey.vk_delta_2, zkeyInit.vk_delta_2, "L section");
        if (sr!==true) {
            if (logger) logger.error("L section does not match");
            return false;
        }

        // Check H
        sr = await sameRatioH();
        if (sr!==true) {
            if (logger) logger.error("H section does not match");
            return false;
        }

        if (logger) logger.info(formatHash(mpcParams.csHash, "Circuit Hash: "));

        await fd.close();
        await fdInit.close();

        for (let i=mpcParams.contributions.length-1; i>=0; i--) {
            const c = mpcParams.contributions[i];
            if (logger) logger.info("-------------------------");
            if (logger) logger.info(formatHash(c.contributionHash, `contribution #${i+1} ${c.name ? c.name : ""}:`));
            if (c.type == 1) {
                if (logger) logger.info(`Beacon generator: ${byteArray2hex(c.beaconHash)}`);
                if (logger) logger.info(`Beacon iterations Exp: ${c.numIterationsExp}`);
            }
        }
        if (logger) logger.info("-------------------------");

        if (logger) logger.info("ZKey Ok!");

        return true;


        async function sectionHasSameRatio(groupName, fd1, sections1, fd2, sections2, idSection, g2sp, g2spx, sectionName) {
            const MAX_CHUNK_SIZE = 1<<20;
            const G = curve[groupName];
            const sG = G.F.n8*2;
            await startReadUniqueSection(fd1, sections1, idSection);
            await startReadUniqueSection(fd2, sections2, idSection);

            let R1 = G.zero;
            let R2 = G.zero;

            const nPoints = sections1[idSection][0].size / sG;

            for (let i=0; i<nPoints; i += MAX_CHUNK_SIZE) {
                if (logger) logger.debug(`Same ratio check ${sectionName}:  ${i}/${nPoints}`);
                const n = Math.min(nPoints - i, MAX_CHUNK_SIZE);
                const bases1 = await fd1.read(n*sG);
                const bases2 = await fd2.read(n*sG);

                const scalars = new Uint8Array(4*n);
                crypto.randomFillSync(scalars);


                const r1 = await G.multiExpAffine(bases1, scalars);
                const r2 = await G.multiExpAffine(bases2, scalars);

                R1 = G.add(R1, r1);
                R2 = G.add(R2, r2);
            }
            await endReadSection(fd1);
            await endReadSection(fd2);

            if (nPoints == 0) return true;

            sr = await sameRatio$2(curve, R1, R2, g2sp, g2spx);
            if (sr !== true) return false;

            return true;
        }

        async function sameRatioH() {
            const MAX_CHUNK_SIZE = 1<<20;
            const G = curve.G1;
            const Fr = curve.Fr;
            const sG = G.F.n8*2;

            const {fd: fdPTau, sections: sectionsPTau} = await readBinFile(pTauFileName, "ptau", 1);

            let buff_r = new BigBuffer(zkey.domainSize * zkey.n8r);

            const seed= new Array(8);
            for (let i=0; i<8; i++) {
                seed[i] = crypto.randomBytes(4).readUInt32BE(0, true);
            }
            const rng = new ChaCha(seed);
            for (let i=0; i<zkey.domainSize-1; i++) {   // Note that last one is zero
                const e = Fr.fromRng(rng);
                Fr.toRprLE(buff_r, i*zkey.n8r, e);
            }
            Fr.toRprLE(buff_r, (zkey.domainSize-1)*zkey.n8r, Fr.zero);

            let R1 = G.zero;
            for (let i=0; i<zkey.domainSize; i += MAX_CHUNK_SIZE) {
                if (logger) logger.debug(`H Verificaition(tau):  ${i}/${zkey.domainSize}`);
                const n = Math.min(zkey.domainSize - i, MAX_CHUNK_SIZE);

                const buff1 = await fdPTau.read(sG*n, sectionsPTau[2][0].p + zkey.domainSize*sG + i*sG);
                const buff2 = await fdPTau.read(sG*n, sectionsPTau[2][0].p + i*sG);

                const buffB = await batchSubstract(buff1, buff2);
                const buffS = buff_r.slice(i*zkey.n8r, (i+n)*zkey.n8r);
                const r = await G.multiExpAffine(buffB, buffS);

                R1 = G.add(R1, r);
            }

            // Caluclate odd coeficients in transformed domain

            buff_r = await Fr.batchToMontgomery(buff_r);
            // const first = curve.Fr.neg(curve.Fr.inv(curve.Fr.e(2)));
            // Works*2   const first = curve.Fr.neg(curve.Fr.e(2));


            let first;

            if (zkey.power < Fr.s) {
                first = Fr.neg(Fr.e(2));
            } else {
                const small_m  = 2 ** Fr.s;
                const shift_to_small_m = Fr.exp(Fr.shift, small_m);
                first = Fr.sub( shift_to_small_m, Fr.one);
            }

            // const inc = curve.Fr.inv(curve.PFr.w[zkey.power+1]);
            const inc = zkey.power < Fr.s ? Fr.w[zkey.power+1] : Fr.shift;
            buff_r = await Fr.batchApplyKey(buff_r, first, inc);
            buff_r = await Fr.fft(buff_r);
            buff_r = await Fr.batchFromMontgomery(buff_r);

            await startReadUniqueSection(fd, sections, 9);
            let R2 = G.zero;
            for (let i=0; i<zkey.domainSize; i += MAX_CHUNK_SIZE) {
                if (logger) logger.debug(`H Verificaition(lagrange):  ${i}/${zkey.domainSize}`);
                const n = Math.min(zkey.domainSize - i, MAX_CHUNK_SIZE);

                const buff = await fd.read(sG*n);
                const buffS = buff_r.slice(i*zkey.n8r, (i+n)*zkey.n8r);
                const r = await G.multiExpAffine(buff, buffS);

                R2 = G.add(R2, r);
            }
            await endReadSection(fd);

            sr = await sameRatio$2(curve, R1, R2, zkey.vk_delta_2, zkeyInit.vk_delta_2);
            if (sr !== true) return false;


            return true;

        }

        async function batchSubstract(buff1, buff2) {
            const sG = curve.G1.F.n8*2;
            const nPoints = buff1.byteLength / sG;
            const concurrency= curve.tm.concurrency;
            const nPointsPerThread = Math.floor(nPoints / concurrency);
            const opPromises = [];
            for (let i=0; i<concurrency; i++) {
                let n;
                if (i< concurrency-1) {
                    n = nPointsPerThread;
                } else {
                    n = nPoints - i*nPointsPerThread;
                }
                if (n==0) continue;

                const subBuff1 = buff1.slice(i*nPointsPerThread*sG1, (i*nPointsPerThread+n)*sG1);
                const subBuff2 = buff2.slice(i*nPointsPerThread*sG1, (i*nPointsPerThread+n)*sG1);
                opPromises.push(batchSubstractThread(subBuff1, subBuff2));
            }


            const result = await Promise.all(opPromises);

            const fullBuffOut = new Uint8Array(nPoints*sG);
            let p =0;
            for (let i=0; i<result.length; i++) {
                fullBuffOut.set(result[i][0], p);
                p+=result[i][0].byteLength;
            }

            return fullBuffOut;
        }


        async function batchSubstractThread(buff1, buff2) {
            const sG1 = curve.G1.F.n8*2;
            const sGmid = curve.G1.F.n8*3;
            const nPoints = buff1.byteLength/sG1;
            const task = [];
            task.push({cmd: "ALLOCSET", var: 0, buff: buff1});
            task.push({cmd: "ALLOCSET", var: 1, buff: buff2});
            task.push({cmd: "ALLOC", var: 2, len: nPoints*sGmid});
            for (let i=0; i<nPoints; i++) {
                task.push({
                    cmd: "CALL",
                    fnName: "g1m_subAffine",
                    params: [
                        {var: 0, offset: i*sG1},
                        {var: 1, offset: i*sG1},
                        {var: 2, offset: i*sGmid},
                    ]
                });
            }
            task.push({cmd: "CALL", fnName: "g1m_batchToAffine", params: [
                {var: 2},
                {val: nPoints},
                {var: 2},
            ]});
            task.push({cmd: "GET", out: 0, var: 2, len: nPoints*sG1});

            const res = await curve.tm.queueAction(task);

            return res;
        }

    }

    async function phase2verifyFromR1cs(r1csFileName, pTauFileName, zkeyFileName, logger) {

        // const initFileName = "~" + zkeyFileName + ".init";
        const initFileName = {type: "bigMem"};
        await newZKey(r1csFileName, pTauFileName, initFileName, logger);

        return await phase2verifyFromInit(initFileName, pTauFileName, zkeyFileName, logger);
    }

    async function phase2contribute(zkeyNameOld, zkeyNameNew, name, entropy, logger) {
        await blake2bWasm.ready();

        const {fd: fdOld, sections: sections} = await readBinFile(zkeyNameOld, "zkey", 2);
        const zkey = await readHeader(fdOld, sections, "groth16");

        const curve = await getCurveFromQ(zkey.q);

        const mpcParams = await readMPCParams(fdOld, curve, sections);

        const fdNew = await createBinFile(zkeyNameNew, "zkey", 1, 10);


        const rng = await getRandomRng(entropy);

        const transcriptHasher = blake2bWasm(64);
        transcriptHasher.update(mpcParams.csHash);
        for (let i=0; i<mpcParams.contributions.length; i++) {
            hashPubKey(transcriptHasher, curve, mpcParams.contributions[i]);
        }

        const curContribution = {};
        curContribution.delta = {};
        curContribution.delta.prvKey = curve.Fr.fromRng(rng);
        curContribution.delta.g1_s = curve.G1.toAffine(curve.G1.fromRng(rng));
        curContribution.delta.g1_sx = curve.G1.toAffine(curve.G1.timesFr(curContribution.delta.g1_s, curContribution.delta.prvKey));
        hashG1(transcriptHasher, curve, curContribution.delta.g1_s);
        hashG1(transcriptHasher, curve, curContribution.delta.g1_sx);
        curContribution.transcript = transcriptHasher.digest();
        curContribution.delta.g2_sp = hashToG2(curve, curContribution.transcript);
        curContribution.delta.g2_spx = curve.G2.toAffine(curve.G2.timesFr(curContribution.delta.g2_sp, curContribution.delta.prvKey));

        zkey.vk_delta_1 = curve.G1.timesFr(zkey.vk_delta_1, curContribution.delta.prvKey);
        zkey.vk_delta_2 = curve.G2.timesFr(zkey.vk_delta_2, curContribution.delta.prvKey);

        curContribution.deltaAfter = zkey.vk_delta_1;

        curContribution.type = 0;
        if (name) curContribution.name = name;

        mpcParams.contributions.push(curContribution);

        await writeHeader(fdNew, zkey);

        // IC
        await copySection(fdOld, sections, fdNew, 3);

        // Coeffs (Keep original)
        await copySection(fdOld, sections, fdNew, 4);

        // A Section
        await copySection(fdOld, sections, fdNew, 5);

        // B1 Section
        await copySection(fdOld, sections, fdNew, 6);

        // B2 Section
        await copySection(fdOld, sections, fdNew, 7);

        const invDelta = curve.Fr.inv(curContribution.delta.prvKey);
        await applyKeyToSection(fdOld, sections, fdNew, 8, curve, "G1", invDelta, curve.Fr.e(1), "L Section", logger);
        await applyKeyToSection(fdOld, sections, fdNew, 9, curve, "G1", invDelta, curve.Fr.e(1), "H Section", logger);

        await writeMPCParams(fdNew, curve, mpcParams);

        await fdOld.close();
        await fdNew.close();

        const contributionHasher = blake2bWasm(64);
        hashPubKey(contributionHasher, curve, curContribution);

        const contribuionHash = contributionHasher.digest();

        if (logger) logger.info(formatHash(mpcParams.csHash, "Circuit Hash: "));
        if (logger) logger.info(formatHash(contribuionHash, "Contribution Hash: "));

        return contribuionHash;
    }

    async function beacon$1(zkeyNameOld, zkeyNameNew, name, beaconHashStr, numIterationsExp, logger) {
        await blake2bWasm.ready();

        const beaconHash = hex2ByteArray(beaconHashStr);
        if (   (beaconHash.byteLength == 0)
            || (beaconHash.byteLength*2 !=beaconHashStr.length))
        {
            if (logger) logger.error("Invalid Beacon Hash. (It must be a valid hexadecimal sequence)");
            return false;
        }
        if (beaconHash.length>=256) {
            if (logger) logger.error("Maximum lenght of beacon hash is 255 bytes");
            return false;
        }

        numIterationsExp = parseInt(numIterationsExp);
        if ((numIterationsExp<10)||(numIterationsExp>63)) {
            if (logger) logger.error("Invalid numIterationsExp. (Must be between 10 and 63)");
            return false;
        }


        const {fd: fdOld, sections: sections} = await readBinFile(zkeyNameOld, "zkey", 2);
        const zkey = await readHeader(fdOld, sections, "groth16");

        const curve = await getCurveFromQ(zkey.q);

        const mpcParams = await readMPCParams(fdOld, curve, sections);

        const fdNew = await createBinFile(zkeyNameNew, "zkey", 1, 10);

        const rng = await rngFromBeaconParams(beaconHash, numIterationsExp);

        const transcriptHasher = blake2bWasm(64);
        transcriptHasher.update(mpcParams.csHash);
        for (let i=0; i<mpcParams.contributions.length; i++) {
            hashPubKey(transcriptHasher, curve, mpcParams.contributions[i]);
        }

        const curContribution = {};
        curContribution.delta = {};
        curContribution.delta.prvKey = curve.Fr.fromRng(rng);
        curContribution.delta.g1_s = curve.G1.toAffine(curve.G1.fromRng(rng));
        curContribution.delta.g1_sx = curve.G1.toAffine(curve.G1.timesFr(curContribution.delta.g1_s, curContribution.delta.prvKey));
        hashG1(transcriptHasher, curve, curContribution.delta.g1_s);
        hashG1(transcriptHasher, curve, curContribution.delta.g1_sx);
        curContribution.transcript = transcriptHasher.digest();
        curContribution.delta.g2_sp = hashToG2(curve, curContribution.transcript);
        curContribution.delta.g2_spx = curve.G2.toAffine(curve.G2.timesFr(curContribution.delta.g2_sp, curContribution.delta.prvKey));

        zkey.vk_delta_1 = curve.G1.timesFr(zkey.vk_delta_1, curContribution.delta.prvKey);
        zkey.vk_delta_2 = curve.G2.timesFr(zkey.vk_delta_2, curContribution.delta.prvKey);

        curContribution.deltaAfter = zkey.vk_delta_1;

        curContribution.type = 1;
        curContribution.numIterationsExp = numIterationsExp;
        curContribution.beaconHash = beaconHash;

        if (name) curContribution.name = name;

        mpcParams.contributions.push(curContribution);

        await writeHeader(fdNew, zkey);

        // IC
        await copySection(fdOld, sections, fdNew, 3);

        // Coeffs (Keep original)
        await copySection(fdOld, sections, fdNew, 4);

        // A Section
        await copySection(fdOld, sections, fdNew, 5);

        // B1 Section
        await copySection(fdOld, sections, fdNew, 6);

        // B2 Section
        await copySection(fdOld, sections, fdNew, 7);

        const invDelta = curve.Fr.inv(curContribution.delta.prvKey);
        await applyKeyToSection(fdOld, sections, fdNew, 8, curve, "G1", invDelta, curve.Fr.e(1), "L Section", logger);
        await applyKeyToSection(fdOld, sections, fdNew, 9, curve, "G1", invDelta, curve.Fr.e(1), "H Section", logger);

        await writeMPCParams(fdNew, curve, mpcParams);

        await fdOld.close();
        await fdNew.close();

        const contributionHasher = blake2bWasm(64);
        hashPubKey(contributionHasher, curve, curContribution);

        const contribuionHash = contributionHasher.digest();

        if (logger) logger.info(formatHash(contribuionHash, "Contribution Hash: "));

        return contribuionHash;
    }

    async function zkeyExportJson(zkeyFileName, verbose) {

        const zKey = await readZKey(zkeyFileName, true);

        return zKey;
    }

    // Format of the output

    async function bellmanContribute(curve, challengeFilename, responesFileName, entropy, logger) {
        await blake2bWasm.ready();

        const rng = await getRandomRng(entropy);

        const delta = curve.Fr.fromRng(rng);
        const invDelta = curve.Fr.inv(delta);

        const sG1 = curve.G1.F.n8*2;
        const sG2 = curve.G2.F.n8*2;

        const fdFrom = await readExisting$2(challengeFilename);
        const fdTo = await createOverride(responesFileName);


        await copy(sG1); // alpha1
        await copy(sG1); // beta1
        await copy(sG2); // beta2
        await copy(sG2); // gamma2
        const oldDelta1 = await readG1();
        const delta1 = curve.G1.timesFr(oldDelta1, delta);
        await writeG1(delta1);
        const oldDelta2 = await readG2();
        const delta2 = curve.G2.timesFr(oldDelta2, delta);
        await writeG2(delta2);

        // IC
        const nIC = await fdFrom.readUBE32();
        await fdTo.writeUBE32(nIC);
        await copy(nIC*sG1);

        // H
        const nH = await fdFrom.readUBE32();
        await fdTo.writeUBE32(nH);
        await applyKeyToChallengeSection(fdFrom, fdTo, null, curve, "G1", nH, invDelta, curve.Fr.e(1), "UNCOMPRESSED", "H", logger);

        // L
        const nL = await fdFrom.readUBE32();
        await fdTo.writeUBE32(nL);
        await applyKeyToChallengeSection(fdFrom, fdTo, null, curve, "G1", nL, invDelta, curve.Fr.e(1), "UNCOMPRESSED", "L", logger);

        // A
        const nA = await fdFrom.readUBE32();
        await fdTo.writeUBE32(nA);
        await copy(nA*sG1);

        // B1
        const nB1 = await fdFrom.readUBE32();
        await fdTo.writeUBE32(nB1);
        await copy(nB1*sG1);

        // B2
        const nB2 = await fdFrom.readUBE32();
        await fdTo.writeUBE32(nB2);
        await copy(nB2*sG2);


        //////////
        /// Read contributions
        //////////
        const transcriptHasher = blake2bWasm(64);

        const mpcParams = {};
        // csHash
        mpcParams.csHash =  await fdFrom.read(64);
        transcriptHasher.update(mpcParams.csHash);

        const nConttributions = await fdFrom.readUBE32();
        mpcParams.contributions = [];
        for (let i=0; i<nConttributions; i++) {
            const c = { delta:{} };
            c.deltaAfter = await readG1();
            c.delta.g1_s = await readG1();
            c.delta.g1_sx = await readG1();
            c.delta.g2_spx = await readG2();
            c.transcript = await fdFrom.read(64);
            mpcParams.contributions.push(c);
            hashPubKey(transcriptHasher, curve, c);
        }

        const curContribution = {};
        curContribution.delta = {};
        curContribution.delta.prvKey = delta;
        curContribution.delta.g1_s = curve.G1.toAffine(curve.G1.fromRng(rng));
        curContribution.delta.g1_sx = curve.G1.toAffine(curve.G1.timesFr(curContribution.delta.g1_s, delta));
        hashG1(transcriptHasher, curve, curContribution.delta.g1_s);
        hashG1(transcriptHasher, curve, curContribution.delta.g1_sx);
        curContribution.transcript = transcriptHasher.digest();
        curContribution.delta.g2_sp = hashToG2(curve, curContribution.transcript);
        curContribution.delta.g2_spx = curve.G2.toAffine(curve.G2.timesFr(curContribution.delta.g2_sp, delta));
        curContribution.deltaAfter = delta1;
        curContribution.type = 0;
        mpcParams.contributions.push(curContribution);


        //////////
        /// Write COntribution
        //////////

        await fdTo.write(mpcParams.csHash);
        await fdTo.writeUBE32(mpcParams.contributions.length);

        for (let i=0; i<mpcParams.contributions.length; i++) {
            const c = mpcParams.contributions[i];
            await writeG1(c.deltaAfter);
            await writeG1(c.delta.g1_s);
            await writeG1(c.delta.g1_sx);
            await writeG2(c.delta.g2_spx);
            await fdTo.write(c.transcript);
        }

        const contributionHasher = blake2bWasm(64);
        hashPubKey(contributionHasher, curve, curContribution);

        const contributionHash = contributionHasher.digest();

        if (logger) logger.info(formatHash(contributionHash, "Contribution Hash: "));

        await fdTo.close();
        await fdFrom.close();

        return contributionHash;

        async function copy(nBytes) {
            const CHUNK_SIZE = fdFrom.pageSize*2;
            for (let i=0; i<nBytes; i+= CHUNK_SIZE) {
                const n = Math.min(nBytes -i, CHUNK_SIZE);
                const buff = await fdFrom.read(n);
                await fdTo.write(buff);
            }
        }

        async function readG1() {
            const buff = await fdFrom.read(curve.G1.F.n8*2);
            return curve.G1.fromRprUncompressed(buff, 0);
        }

        async function readG2() {
            const buff = await fdFrom.read(curve.G2.F.n8*2);
            return curve.G2.fromRprUncompressed(buff, 0);
        }

        async function writeG1(P) {
            const buff = new Uint8Array(sG1);
            curve.G1.toRprUncompressed(buff, 0, P);
            await fdTo.write(buff);
        }

        async function writeG2(P) {
            const buff = new Uint8Array(sG2);
            curve.G2.toRprUncompressed(buff, 0, P);
            await fdTo.write(buff);
        }


    }

    const {stringifyBigInts: stringifyBigInts$5} = utils$1;


    async function zkeyExportVerificationKey(zkeyName, logger) {

        const {fd, sections} = await readBinFile(zkeyName, "zkey", 2);
        const zkey = await readHeader(fd, sections, "groth16");

        const curve = await getCurveFromQ(zkey.q);
        const sG1 = curve.G1.F.n8*2;

        const alphaBeta = await curve.pairing( zkey.vk_alpha_1 , zkey.vk_beta_2 );

        let vKey = {
            protocol: zkey.protocol,
            curve: curve.name,
            nPublic: zkey.nPublic,

            vk_alpha_1: curve.G1.toObject(zkey.vk_alpha_1),

            vk_beta_2: curve.G2.toObject(zkey.vk_beta_2),
            vk_gamma_2:  curve.G2.toObject(zkey.vk_gamma_2),
            vk_delta_2:  curve.G2.toObject(zkey.vk_delta_2),

            vk_alphabeta_12: curve.Gt.toObject(alphaBeta)
        };

        // Read IC Section
        ///////////
        await startReadUniqueSection(fd, sections, 3);
        vKey.IC = [];
        for (let i=0; i<= zkey.nPublic; i++) {
            const buff = await fd.read(sG1);
            const P = curve.G1.toObject(buff);
            vKey.IC.push(P);
        }
        await endReadSection(fd);

        vKey = stringifyBigInts$5(vKey);

        await fd.close();

        return vKey;
    }

    // Not ready yet
    // module.exports.generateVerifier_kimleeoh = generateVerifier_kimleeoh;



    async function exportSolidityVerifier(zKeyName, templateName, logger) {

        const verificationKey = await zkeyExportVerificationKey(zKeyName);

        const fd = await readExisting$2(templateName);
        const buff = await fd.read(fd.totalSize);
        let template = new TextDecoder("utf-8").decode(buff);

        const vkalpha1_str = `${verificationKey.vk_alpha_1[0].toString()},`+
                            `${verificationKey.vk_alpha_1[1].toString()}`;
        template = template.replace("<%vk_alpha1%>", vkalpha1_str);

        const vkbeta2_str = `[${verificationKey.vk_beta_2[0][1].toString()},`+
                             `${verificationKey.vk_beta_2[0][0].toString()}], `+
                            `[${verificationKey.vk_beta_2[1][1].toString()},` +
                             `${verificationKey.vk_beta_2[1][0].toString()}]`;
        template = template.replace("<%vk_beta2%>", vkbeta2_str);

        const vkgamma2_str = `[${verificationKey.vk_gamma_2[0][1].toString()},`+
                              `${verificationKey.vk_gamma_2[0][0].toString()}], `+
                             `[${verificationKey.vk_gamma_2[1][1].toString()},` +
                              `${verificationKey.vk_gamma_2[1][0].toString()}]`;
        template = template.replace("<%vk_gamma2%>", vkgamma2_str);

        const vkdelta2_str = `[${verificationKey.vk_delta_2[0][1].toString()},`+
                              `${verificationKey.vk_delta_2[0][0].toString()}], `+
                             `[${verificationKey.vk_delta_2[1][1].toString()},` +
                              `${verificationKey.vk_delta_2[1][0].toString()}]`;
        template = template.replace("<%vk_delta2%>", vkdelta2_str);

        // The points

        template = template.replace("<%vk_input_length%>", (verificationKey.IC.length-1).toString());
        template = template.replace("<%vk_ic_length%>", verificationKey.IC.length.toString());
        let vi = "";
        for (let i=0; i<verificationKey.IC.length; i++) {
            if (vi != "") vi = vi + "        ";
            vi = vi + `vk.IC[${i}] = Pairing.G1Point(${verificationKey.IC[i][0].toString()},`+
                                                    `${verificationKey.IC[i][1].toString()});\n`;
        }
        template = template.replace("<%vk_ic_pts%>", vi);

        return template;
    }

    var zkey = /*#__PURE__*/Object.freeze({
        __proto__: null,
        newZKey: newZKey,
        exportBellman: phase2exportMPCParams,
        importBellman: phase2importMPCParams,
        verifyFromR1cs: phase2verifyFromR1cs,
        verifyFromInit: phase2verifyFromInit,
        contribute: phase2contribute,
        beacon: beacon$1,
        exportJson: zkeyExportJson,
        bellmanContribute: bellmanContribute,
        exportVerificationKey: zkeyExportVerificationKey,
        exportSolidityVerifier: exportSolidityVerifier
    });

    exports.groth16 = groth16;
    exports.powersOfTau = powersoftau;
    exports.r1cs = r1cs;
    exports.wtns = wtns;
    exports.zKey = zkey;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

}({}));