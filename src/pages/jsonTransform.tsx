
const stepTypeMapping: { [key: string]: string } = {
  "alternativas": "Alternatives",
  "verdadero/falso": "TrueFalse",
  "singleplaceholder": "SinglePlaceholder",
  "multipleplaceholder": "MultiplePlaceholder",
  "table": "TableStep"
};

export function generarEjercicioJSON(cards: any[], code:string, title: string) {
  const ejercicio = {
    title:title||"Titulo por defecto", //titulo del ejercicio distinto al enunciado, este se muestra en todo momento arriba del ejercico
    eqc: cards[0].expression||"Expresion por defecto enunciado",   // expresión opcional, utilizado en algunos ejercicios y en otros no (ejemplo en el de succ1, en otros como uni1 ni siquiera existe el parametro)
    img: "",   // imagen opcional no lo tratamos nostros
    code: code, // código del ejercicio se extrae directamente del modal que se abre al guardar el ejercico (parametro de la funcion)
    meta: {}, // campo necesario, aunque vacío, por lo que hable con felipe es un campo para meta datos aun que no se si sigue en uso
    text: cards[0].title||"Enunciado por defecto", // texto opcional, texto del enunciado hay ejercicio que lo utilizan otros no, se extraer directamente de la tarjeta enunciado
    type: "lvltutor2", // tipo de implementacion a invocar, estático y obligatorio
    steps: cards.slice(1).map((card, index) => ({ //arreglo de steps con todo lo que tienen que llevar, el slice corta la primera tarjeta que es la del enunciado
      StepType: stepTypeMapping[card.type] || "", // tipo de paso utiliza el map que cree arriba para no tener que cambiar nada en newExercise
      stepTitle: card.title || "Titulo paso por defecto", // título del paso
      stepId: index.toString(), // ID progresivo del paso autogenerado
      displayResult: card.latex || ["Expresion por defecto"], // debe ser una lista no entiendo por que, cumple como expresion en los ejercicios de tipo single placeholder, multiple placeholder, alternativas
      expression: card.latex || "Expresion por defecto", // expresión del paso se usa en verdadero y falso, en los de tipo tabla de verdad
      KCs: (card.kcs).split(",") || ["kc_por_defecto_no_se_asigno_Kc"], // arreglo de KCs
      hints: (card.hints || []).map((hint: any, hintIndex: number) => ({ // arreglo de hints
        hint: hint.text || "Texto hint por defecto", // texto de la hint
        hintId: hintIndex, // ID progresivo de la hint
        expression: hint.latex
      })),
      values: stepTypeMapping[card.type] === "Alternatives" ? card.alternatives.map((alternative: any) => ({ 
        name: alternative.text || [], // nombre de la alternativa, aun que en la implementacion no se utiliza lo dejo aqui asi para futuro
        value: alternative.text || [] // valor de la alternativa, es el contenido este es el que se utiliza para verificar cual es la correcta
        
      }))//true or false no lo ocupa sin embargo hay ejercicios que si lo tienen, multiplaceholder tampoco, single placeholder tampoco y table tampoco
      || []: card.values,
      /*
      Uso exlcusivo de los ejercicios de tipo tablas, cacho maximo

      table: {"rows":[{"data":["","",""]},{},{}], "header":[{"align": "center","value": ""}],"alignRows": "center","tableCaption": ""},
      button: [["V","F"],["V","F"],["V","F"],["V","F"]], */
      
      //answers tiene el arreglo de respuestas que varia segun el tipo de ejercicio y next step que es el paso siguente y sera -1 si es el ultimo
      answers: stepTypeMapping[card.type] === "Alternatives" ?[{"answer":[(card.alternatives?.find((alt: any) => alt.correct)?.text || "")]/*Busca el primer elemento que sea correcto*/, "nextStep": index==cards.length - 2 ? "-1": index+1 /* -1 si es el último paso */}]:
               stepTypeMapping[card.type] === "TrueFalse" ?[{"answer":[card.trueOption === true? ["V"]: "F" ], "nextStep": index==cards.length - 2 ? "-1": index+1 }]: "",
      
      validation:"", // campo donde se establece que tipo de validacion se utilizara para corregir la respuestas relevante en placeholder y blank, sin embargo la implementacion actual del lvltutor utiliza string comparisson por defecto, hay que ver como se comporta con otras cosas
      summary: card.summary || "Resumen por defecto", // resumen del paso
      correctMsg: card.successMessage || "Mensaje correcto por defecto", // mensaje de éxito
      incorrectMsg: card.incorrectMessage || "Mensaje fallo por defecto", // mensaje de error
      matchingError: [] // no he encontrado donde se ocupa no entie do para que es
    }))
  };

  return JSON.stringify(ejercicio, null, 2); // Formateado para facilidad de lectura
}

export function descargarJSON(ejercicioJSON: string, nombreArchivo = "ejercicio.json") {
  const blob = new Blob([ejercicioJSON], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
