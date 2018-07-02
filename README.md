

# Drone Cafe

Система автоматизации ресторана в рамках итоговой работы по курсу "Node, AngularJS и MongoDB: разработка полноценных веб-приложений".

### Ссылки на рабочую версию

Client: [http://aqueous-forest-93594.herokuapp.com/#!/](http://aqueous-forest-93594.herokuapp.com/#!/)
Kitchen: [http://aqueous-forest-93594.herokuapp.com/#!/kitchen](http://aqueous-forest-93594.herokuapp.com/#!/kitchen)

### preinstall

```
    install and run MongoDB
```

### install

```
    git clone https://github.com/maksim-maslov/nd-dp 
    cd nd-dp
    npm install
    mongoimport --db DroneCafe --collection dishes --file menu.json --jsonArray
    npm start
    http://localhost:3000
```

### run tests

```
    npm test
    npm run e2e
```

### Структура файлов проекта

```
app/                    --> файлы клиента
  src/                  --> папка angular-приложения
    Cook/               --> интерфейс повара
      Cook.html         --> представление
      CookCtrl.js       --> контроллер
      CookService.js    --> сервис
    Client/             --> интерфейс клиента
      Client.html       --> представление
      ClientCtrl.js     --> контроллер
      ClientService.js  --> сервис
    app.js              --> главный модуль
index.html            	--> главная страница приложения 
server.js               --> файл сервера
controller.js           --> контроллер
route.js                --> роуты
realtime.js             --> сокеты
models/                 --> модели БД
test/                   --> тесты
node_modules/           --> npm пакеты
package.json            --> файл конфигурации
README.md               --> описание проекта
```