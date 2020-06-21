
function addScript(url, onloaded, options) {
    const sc = document.createElement("script");
    sc.src = url || '//cdnjs.cloudflare.com/ajax/libs/annyang/2.4.0/annyang.min.js';
    document.body.appendChild(sc);
    if (onloaded) {
        sc.addEventListener('load', onloaded, options)
    }
    return sc;
}

function helpCommand() {
    var helpText = getModels().map(getName);
    console.log(helpText);
}

function startListening() {
    if (!annyang) {
        console.log('Unable to load annyang');
        return;
    }
    var helloCommand = {
        'hello': () => { alert('Hello world!'); }
    };
    annyang.addCommands(helloCommand);

    addCommandsFromModels();
    addCommands(getTextButtonCommands())

    annyang.addCommands({ 
        'list (commands)': helpCommand,
        'debug': () => annyang.debug(), 
        'debug off': () => annyang.debug(false),
        'search for *text': searchFor 
    });

    if (!SpeechKITT) {
        console.log('Unable to load SpeechKITT');
        annyang.start();
        return;
    }

    // Tell KITT to use annyang
    SpeechKITT.annyang();

    // Define a stylesheet for KITT to use
    SpeechKITT.setStylesheet('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/0.3.0/themes/flat.css');

    SpeechKITT.displayRecognizedSentence(true);

    // Render KITT's interface
    SpeechKITT.vroom();
}

addScript('//cdnjs.cloudflare.com/ajax/libs/annyang/2.4.0/annyang.min.js',
    () => addScript('//cdnjs.cloudflare.com/ajax/libs/SpeechKITT/1.0.0/speechkitt.min.js', startListening)
);


function getName(model) {
    return (model.title || model.getAttribute("data-name")).replace('_sg', ' ').replace('_portraits', '').replace('_', ' ').replace(/s\b/, '(s)')
}

function makeCommand(text, command) {
    return { [text]: command };
}

function getModels(queryModels = document.querySelectorAll('.model')) {
    var slice = Array.prototype.slice;
    var models = slice.apply(queryModels);
    return models;
}

function getCommands(models = getModels()) {
    // click model when spoken
    var cmds = models.map(m => makeCommand(getName(m), m.click.bind(m)))
    return cmds;
}

function addCommandsFromModels(cmds = getCommands()) {
    return addCommands(cmds);
}

function queryDocument(query = '.speakable') {
    var slice = Array.prototype.slice;
    var found = document.querySelectorAll(query);
    return slice.apply(found);
}

function getTextButtons() {
    return queryDocument('.buttons .text_button');
}

function getTextButtonCommands(textBtns = getTextButtons()) {
    // click text button when spoken
    var cmds = textBtns.map(btn => makeCommand(btn.textContent, btn.click.bind(btn)));
    return cmds;
}

function addCommands(cmds) {
    return cmds.map(cmd => annyang.addCommands(cmd));
}

function searchFor(text, elem=document.querySelector('input[type=search]')) {
    annyang.trigger('search');
    elem.value = text;
    elem.autofocus = true
    if (elem.oninput) {
        elem.oninput();
    }
}
