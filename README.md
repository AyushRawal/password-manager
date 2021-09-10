# Password Manager

<a href="https://github.com/AyushRawal/password-manager/issues"><img alt="GitHub issues" src="https://img.shields.io/github/issues/AyushRawal/password-manager?style=flat-square"></a> <a href="https://github.com/AyushRawal/password-manager/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/AyushRawal/password-manager?style=flat-square"></a> <a href="https://github.com/AyushRawal/password-manager/blob/main/LICENSE"><img alt="GitHub license" src="https://img.shields.io/github/license/AyushRawal/password-manager?style=flat-square"></a> <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-Welcome-green?style=flat-square"></a>

The most secure way to manage passwords online (theoretically).

## Try out Password Manager

### [Live](https://ayushrawal.github.io/password-manager)

## Screenshots

<p align="center">
<img src="./screenshots/1.png"><br/><br/>
<img src="./screenshots/2.png"><br/><br/>
<img src="./screenshots/3.png" style="width: 250px;">&nbsp;&nbsp;
<img src="./screenshots/4.png" style="width: 250px;">
</p>

## About Password Manager 📖

I have always struggled with my passwords. I use capital letters, numbers, special symbols in my passwords and keep them unrelated to myself for maximum security and peace of mind, but that also makes them hard to remember, especially when there are so many of them.<br>
Sure, I could use any of the password managers available out there, but cyber attacks on those are not a rare sight.<br>
So, I built this project.<br>
The best way to store passwords of multiple users, I thought, was to hash them using their master password.

But, this approach has a few disadvantages too.<br>
If a user forgets his/her master password, he/she loses all the passwords, i.e., there can be no "Forgot Password" feature.

To help with that, I am using [Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Secret_sharing#Shamir's_scheme) algorithm.

User can generate recovery keys, any 3 of which can be used to retrieve the master password later.

This is the web frontend of the project.

## Also check out

The backend repository: [password-manager-backend](https://github.com/AyushRawal/password-manager-backend).

I have also made a CLI client for this: [passman](https://github.com/AyushRawal/password-manager-cli).

## Support 🙏

Please drop a star ⭐ if you like this project.

_**Note :** Please feel free to ask for a feature or report any bug by opening an issue._

<br/><p align=center>Made with ❤️ for 🌏 Everyone</p>
