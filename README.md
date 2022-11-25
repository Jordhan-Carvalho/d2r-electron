# Dota 2 reminders - Electron App 

![Elder](dev_assets/elder.png?raw=true "Elder")


## General
This is windows app (electron based) that will listen to your dota 2 game events and play a sound to remind you something that you perceive as important, such as bounty rune time, stack time etc...

You can run it on your own machine or host it somewhere else.

## Features

- Automatically listen to your game status
- You can choose a range of different reminders (stack time, neutral items, smoke, wards,)
  - stack (every xx:xx:44)
  - wards (every time it is available in the shop with a delay of 40 seconds to avoid spam)
  - smoke (1 stock takes 7 minutes to replenish, so that's the reminder time)
  - bounty runes (2 seconds before spawn)
  - mid runes (4 seconds before spawn)
  - neutral items (every time a new tier is available to drop)
- You can edit the reminders anytime you want

## How to install
So you will need to follow the 3 steps:
1 - Download the app
2 - Configure the dota client to send events to the app
3 - Run the server

### 1 - Download the app
Links

### 2 - Gamestate integration
First thing to do is prepare your dota client to send in-game information to the app.
For that you need to enable the game state integration, you can use the overwolf guide for that:
https://support.overwolf.com/en/support/solutions/articles/9000212745-how-to-enable-game-state-integration-for-dota-2
Then copy the gamestate_integration_d2reminders.cfg file to your dota cfg folder.
If you never used overwolf you probably do not have the gamestate_integration folder, in that case just manually create it:
![DotaFolder](dev_assets/gamestatePath.png?raw=true "Gamestate path")
* The gamestate_integration_d2reminders.cfg is found on this repository and also included on the zip file

## Roadmap
- Tests SHAME
- Turbo game mode
- Persist configuration
- Support Roshan and Aegis time
- Tower in deny range

## MIT License

Copyright (c) 2012-2022 Jordhan Carvalho and others

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
