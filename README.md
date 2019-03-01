Jade Lizard - A Stock Microservice
========================

# Task

A market data subscription microservice with two routes

- Subscribe
- Unsubscribe

## Prerequisites

The application needs the below to function;

Node - https://nodejs.org/en/download/

Web browser (eg chrome) - https://www.google.com/chrome/

API Tester(eg postman) - https://www.getpostman.com/downloads/

## How to Run

1. Clone this repo
2. Change into the repo and run `npm install`
3. Run `npm start`
4. Visit 'localhost:3000' in your broswer
5. Copy the user id, paste into postman and use it to send a post request to 'localhost:3000/subscribe' to a stock feed as below;

`{
  "id" : "user_id",
  "stocks" : ["Stock_1", "Stock_2"]
}`

6. In the browser the stock feed is now available
7. To unsubscribe, make the same request to 'localhost:3000/unsubscribe', listing the stocks you would like to remove
8. To run tests `npm test`
9. Enjoy!


## My Approach

How do I want this to work??

A rough outline of the chunks of work I identified

1. Host an express app
2. Clients can visit the server and are logged as a new users
3. Once they leave, the user is removed from storage
4. They can (somehow) make a request to subscribe with a list of stocks they want to know about
5. These stocks are added to their profile
6. Via a similar process they can unsubscribe from services
7. When they are subscribed, new data is pushed out only about the stocks they have subscribed to
8. If no one is subscribed, the server should not trigger any functions

## Technology used

- Express Server
- Socket.io
- Jquery
- Small amount of front end javascript


## Things to Improve

- **Testing**
With more time I would like to write more tests and follow the entire project through with a test driven approach and do some more research into testing web sockets. For example the tests don't really work well as they just mock behaviour for a user and don't actually create a new socket instance. In their current form they also need some changed to the main code to run which is not ideal. This is something I would like to spend more time on.

- **Subscribe and Unsubscribe Functions**
These feel quite clunky and bigger than they need to be, I'm sure this can be done with one function.
Also there is no user id validation. This is not really a problem at this stage but it's not very defensive so something I would like to build in.
**Also at the moment, if a user unsubscribes from a stock, this is removed from all subscribed stocks, even if another user is still using it**

- **Auto Pushing of New Stock Info**
This is something I started and didn't quite solve. Within the server there is an array of subscribed services, the thinking with this is that I only want to be pushing info on stocks that actually have subscribers. If no one is online then there's no need. By having this array which can be empty I thought this would be a good start.
Right now, the clients receive an array with their subscribed stocks, my thinking is that in the future this can be used with not too much more work to bundle some more info on the stocks and send it straight to the browser. At the moment it just logs to the console

Regarding the push function, I'd like this to only fire when there is a user with stock subscriptions. This will save resources on the server side.

- **Stop Using postman**
Going forward the application will need another way of making the subscribe/unsubscribe requests. My Thinking behind going this way was that in the future at some point these request routes can be easily integrated into other applications (eg text messaging, other dashboards)
