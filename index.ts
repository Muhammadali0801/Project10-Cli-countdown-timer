#! /usr/bin/env node

import inquirer from "inquirer";
import { differenceInSeconds } from "date-fns";
import chalk from "chalk";

async function startTimer() {
  console.log(chalk.blue("Welcome to the Timer App!"));

  const responses = await inquirer.prompt({
    name: "Userinput",
    type: "number",
    message: chalk.green("Please enter the amount of seconds: "),
    validate: (input) => {
      if (isNaN(input)) {
        return chalk.redBright("Please enter a valid number");
      } else if (input > 60) {
        return chalk.redBright("Seconds must be within 60");
      } else {
        return true;
      }
    },
  });

  let input = responses.Userinput;

  function startTime(value: number) {
    const initialTime = new Date().setSeconds(new Date().getSeconds() + value);
    const intervalTime = new Date(initialTime);
    const timer = setInterval(() => {
      const currentTime = new Date();
      const timeDifference = differenceInSeconds(intervalTime, currentTime);
      if (timeDifference <= 0) {
        console.log(chalk.yellow("Timer has expired"));
        clearInterval(timer);
        askToRetry();
      } else {
        const minutes = Math.floor(timeDifference % (3600 * 24) / 3600);
        const seconds = Math.floor(timeDifference % 60);
        console.log(`${minutes.toString().padStart(2, "0")}: ${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);
  }

  async function askToRetry() {
    const replay = await inquirer.prompt([
      {
        name: "replay",
        type: "confirm",
        message: "Do you want to set another timer?",
      },
    ]);

    if (replay.replay) {
      startTimer();
    } else {
      console.log(chalk.yellow("Thank you for using the Timer App!"));
      process.exit();
    }
  }

  startTime(input);
}

startTimer();
