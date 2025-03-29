# Gulp сборка для верстки сайтов

## Обновленная версия 2025 / 03 с заменой task на function

### Предустановки

- HTML,
- SCSS,
- Gulp, file-include
- JS,
- Swiper slider
- Scrollreveal
- Мобильная адаптация
- Возможность указать каталог сборки build / docs (по-умолчанию docs)

##### Установить зависимости:
```
npm i
```

##### Зпустить в режиме разработки:
```
gulp
```

##### Собрать версию для публикации:
```
gulp build
```

#### Fonts

Конвертация шрифтов OTF->TTF, TTF->WOFF, WOFF->WOFF2 с копией в `src/fonts`. Если, только WOFF/Woff2 - копируются в `build`

Все шрифты автоматически собираются в "src\scss\base\_fontsAutoGen.scss".
При этом, важно! Название - плотность - курсив разделять пробелами
- `Montserrat-Bold-Italic.ttf`
- `Inter-Regular.ttf`

При подключении только внешних шрифтов, `src/fonts` оставить пустым

#### Important!!!

##### Styles

`- npm i sass@1.77.8` - последняя версия позволяющий работать с `@import` в SCSS

##### Images

Обязательно добавить `{ encoding: false }` в путь источника, т.к. начиная с GULP 5.0 изображение по-умолчанию передается текстовой строкой
`.pipe(src(path.source.img, { encoding: false }))`

[`gulp-picture-html`](https://github.com/WpWebr/gulp-picture-html) - расширение для Gulp, заменит элемент html `<img>` на `<picture>`


###### Например

```
// Изменяет тэг 'img'
  <img src="img/image.jpg" alt="image">
``` 

```
// на 'picture'
<picture>
    <source srcset="img/image.avif" type="image/avif">
    <source srcset="img/image.webp" type="image/webp">
    <img src="img/image.jpg" alt="image">
</picture>
```

Чтобы не делать преобразование - добавить `class="no-picture"` к тэгу `<img>`
Убрать все  `class="no-picture"` из тэгов `<img>` - установить в `gulpfile.js`:

```
const pictureHTMLConfig = {
    noPictureDel: true
};
```

##### Svg Sprite

Собирает svg в './docs/img/svgsprite'
`gulp sprite` - в 'sprite.symbol.svg'
`gulp stack` - в 'sprite.stack.svg'

[GitHub сборка:](https://github.com/Kovalchuk-Alexandr/Gulp-v04-2025.git)
