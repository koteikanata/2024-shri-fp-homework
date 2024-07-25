/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const {
    __,
    all,
    allPass,
    any,
    complement,
    compose,
    countBy,
    equals,
    filter,
    gte,
    identity,
    length,
    propEq,
    values,
} = require('ramda');

const isWhite = equals('white');
const isRed = equals('red');
const isOrange = equals('orange');
const isGreen = equals('green');
const isBlue = equals('blue');

const isNotWhite = complement(equals('white'));
const countColors = (isColorFn) => compose(length, filter(isColorFn), values);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([
    propEq('star', 'red'),
    propEq('square', 'green'),
    propEq('triangle', 'white'),
    propEq('circle', 'white'),
]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(gte(__, 2), countColors(isGreen));

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (figures) =>
    equals(countColors(isRed)(figures), countColors(isBlue)(figures));

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([
    propEq('circle', 'blue'),
    propEq('star', 'red'),
    propEq('square', 'orange'),
]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(
    any(gte(__, 3)),
    values,
    countBy(identity),
    filter(isNotWhite),
    values,
);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    compose(equals(2), countColors(isGreen)),
    compose(equals(1), countColors(isRed)),
    propEq('triangle', 'green'),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (figures) => all(isOrange)(values(figures));

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([
    complement(propEq('star', 'white')),
    complement(propEq('star', 'red')),
]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(all(isGreen), values);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета.
export const validateFieldN10 = ({ square, triangle }) =>
    equals(triangle, square) && isNotWhite(triangle);
