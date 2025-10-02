import speech_recognition as sr
import pyttsx3

# Initialize speech components
recognizer = sr.Recognizer()
engine = pyttsx3.init()
tasks = []

def speak(text):
    engine.say(text)
    engine.runAndWait()

def recognize_speech():
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)
        try:
            audio = recognizer.listen(source, timeout=5)
            return recognizer.recognize_google(audio).lower()
        except sr.WaitTimeoutError:
            return "Sorry, I didn't hear anything."
        except sr.UnknownValueError:
            return "Sorry, I couldn't understand you."
        except sr.RequestError:
            return "Speech recognition service error."

def process_command(command):
    if "add task" in command:
        task = command.replace("add task", "").strip()
        tasks.append(task)
        return f"Added task: {task}"
    elif "list tasks" in command:
        return "Tasks: " + ", ".join(tasks) if tasks else "No tasks."
    elif "complete task" in command:
        task = command.replace("complete task", "").strip()
        if task in tasks:
            tasks.remove(task)
            return f"Completed task: {task}"
        return "Task not found."
    elif "exit" in command:
        return "exit"
    return "Say 'add task', 'list tasks', 'complete task', or 'exit'."

def main():
    speak("Welcome to the Voice To-Do List. Say a command.")
    while True:
        command = recognize_speech()
        response = process_command(command)
        print(response)
        speak(response)
        if response == "exit":
            break

if __name__ == "__main__":
    main()
