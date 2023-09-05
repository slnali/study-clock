import {
  Box,
  Card,
  HStack,
  IconButton,
  Input,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { BsPauseFill, BsPlay } from "react-icons/bs";
import { GrPowerReset } from "react-icons/gr";

const initialState = {
  breakLength: 5,
  sessionLength: 25,
  timeLeft: "25:00",
  sessionActive: true,
  intervalId: null,
  paused: false,
  timerRunning: false,
};

class ProcrastinateTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.decreaseLength = this.decreaseLength.bind(this);
    this.increaseLength = this.increaseLength.bind(this);
    this.updateLength = this.updateLength.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.pauseTimer = this.pauseTimer.bind(this);
    this.reset = this.reset.bind(this);
    this.updateTimeLeftLabel = this.updateTimeLeftLabel.bind(this);
  }

  formatTimeLabel(sessionLength) {
    return `${sessionLength}:00`;
  }

  updateTimeLeftLabel(property, newValue) {
    if (
      property.toLowerCase().includes("session") &&
      !this.state.timerRunning
    ) {
      this.setState({ timeLeft: this.formatTimeLabel(newValue) });
    }
  }

  decreaseLength(property) {
    if (this.state[property] > 1) {
      const newValue = this.state[property] - 1;
      this.setState({ [property]: newValue });
      this.updateTimeLeftLabel(property, newValue);
    }
  }

  increaseLength(property) {
    if (this.state[property] < 60) {
      const newValue = this.state[property] + 1;
      this.setState({ [property]: newValue });
      this.updateTimeLeftLabel(property, newValue);
    }
  }

  updateLength(event, property) {
    const inputVal = event.target.value;
    if (isNaN(inputVal) || inputVal.length == 0) {
      return;
    }
    let newValue = parseInt(inputVal);
    if (newValue > 60 || newValue < 1) {
      if (newValue > 60) {
        newValue = 60;
      } else {
        newValue = 1;
      }
      this.setState({ [property]: newValue });
    } else {
      this.setState({ [property]: newValue });
    }
    //check property string contains text
    this.updateTimeLeftLabel(property, newValue);
  }

  updateBreak = (event) => {
    this.updateLength(event, "breakLength");
  };

  updateSession = (event) => {
    this.updateLength(event, "sessionLength");
  };

  // when i click on the start button, a timer should start
  startTimer() {
    // set a timer to minutes and seconds
    // initialise a timer
    let timeLeft = 60 * this.state.sessionLength;
    if (this.state.paused) {
      var splitTime = this.state.timeLeft.split(":");
      timeLeft = 60 * parseInt(splitTime[0]) + parseInt(splitTime[1]);
      this.setState({ paused: false });
    }
    this.setState({ timerRunning: true });
    const intervalId = setInterval(() => {
      if (timeLeft == 0) {
        if (this.state.sessionActive) {
          //start break timer
          this.setState({ sessionActive: false });
          timeLeft = 60 * this.state.breakLength;
        } else {
          //start session timer
          this.setState({ sessionActive: true });
          timeLeft = 60 * this.state.sessionLength;
        }
      } else {
        timeLeft--;
        //convert timeleft to minutes and seconds
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const formattedString = `${minutes}:${
          seconds < 10 ? "0" : ""
        }${seconds}`;
        this.setState({ timeLeft: formattedString });
      }
    }, 300);
    this.setState({ intervalId: intervalId });
  }

  pauseTimer() {
    clearInterval(this.state.intervalId);
    this.setState({ paused: true, timerRunning: false });
    //update sessionLength
  }

  reset() {
    clearInterval(this.state.intervalId);
    this.setState(initialState);
  }

  render() {
    return (
      <>
        <Box width="100vw" height="100vh" background="azure">
          <VStack paddingTop={250} spacing={10} alignItems="center">
            <Text fontSize="6xl">25 + 5 Clock</Text>
            <Stack direction={["column", "row"]}>
              <VStack>
                <Text fontSize="2xl">Break Length</Text>
                <HStack>
                  <IconButton
                    id="decreaseBreak"
                    onClick={() => this.decreaseLength("breakLength")}
                    icon={<AiOutlineMinus />}
                    colorScheme="blue"
                    size="lg"
                  />
                  <Input
                    size="md"
                    value={this.state.breakLength}
                    onInput={this.updateBreak}
                    borderColor="blue.800"
                  />
                  <IconButton
                    id="increaseBreak"
                    onClick={() => this.increaseLength("breakLength")}
                    icon={<AiOutlinePlus />}
                    colorScheme="blue"
                    size="lg"
                  />
                </HStack>
              </VStack>
              <VStack>
                <Text fontSize="2xl">Session Length</Text>
                <HStack>
                  <IconButton
                    id="decreaseSession"
                    onClick={() => this.decreaseLength("sessionLength")}
                    icon={<AiOutlineMinus />}
                    colorScheme="green"
                    size="lg"
                  />
                  <Input
                    size="md"
                    value={this.state.sessionLength}
                    onInput={this.updateSession}
                    borderColor="green.800"
                  />
                  <IconButton
                    id="increaseSession"
                    onClick={() => this.increaseLength("sessionLength")}
                    icon={<AiOutlinePlus />}
                    colorScheme="green"
                    size="lg"
                  />
                </HStack>
              </VStack>
            </Stack>
            <Card
              color="white"
              width="30%"
              height="90%"
              padding={4}
              borderRadius="lg"
              outlineColor="red"
            >
              <VStack>
                {this.state.sessionActive ? (
                  <Text fontSize="2xl">Session</Text>
                ) : (
                  <Text fontSize="2xl">Break</Text>
                )}
                <Text fontSize="2xl">{this.state.timeLeft}</Text>
              </VStack>
            </Card>
            <HStack>
              <IconButton
                id="startTimer"
                onClick={this.startTimer}
                icon={<BsPlay />}
                isDisabled={this.state.timerRunning}
                backgroundColor="yellow"
                size="lg"
              />
              <IconButton
                id="pauseTimer"
                onClick={this.pauseTimer}
                icon={<BsPauseFill />}
                isDisabled={this.state.paused}
                backgroundColor="yellow"
                size="lg"
              />
              <IconButton
                id="resetTimer"
                icon={<GrPowerReset />}
                onClick={this.reset}
                backgroundColor="yellow"
                size="lg"
              />
            </HStack>
            <VStack>
              <Text color="red.300" size={"small"}>
                Designed and coded by
              </Text>
              <Text>Nalintha Wijesinghe</Text>
            </VStack>
          </VStack>
        </Box>
      </>
    );
  }
}

export default ProcrastinateTimer;
