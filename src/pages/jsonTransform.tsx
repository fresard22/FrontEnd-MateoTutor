/*
json guia con anotaciones mias
{
  "eqc": "",   no es necesario, expresion del enunciado
  "img": "",	no es necesario, imagen del paso
  "code": "succ1", necesario codigo del ejercicio	
  "meta": {}, no se lo que es, hay que dejarlo para que no de error 
  "text": "", no es necesario, texto enunciado
  "type": "lvltutor2", 100% necesario
  "steps": [ arreglo de pasos del ejercicio, necesario
      {
      "StepType": "MultiplePlaceholders", tipo de paso, necesario
      "stepTitle": "Paso 1: Represente el término de la sucesión", titulo del paso, 
      "stepId": "0",
      "displayResult": [
        "B_1 = \\frac{{(-1)^\\placeholder[a]{n} \\cdot (\\placeholder[b]{n}^2 - \\placeholder[c]{n})}}{{\\placeholder[d]{n}^2 + 1}}"
      ], cumple como expresion en los ejercicios de tipo single placeholder, multiple placeholder, alternativas
      "expression": "", expresion del paso se usa en verdadero y falso, en los de tipo tabla 
      "KCs": ["","",""], arreglo de kcs del paso, necesaario
      "hints": [ arreglo de hints del paso, necesario
        {
          "hint": "", texto de la hint, necesario
          "hintId": 0 id de la hint, necesario y autogenerado
        },
        {
          "hint": "",
          "hintId": 1
        },
        {
          "hint": "",
          "hintId": 2
        }
      ],
      "values": [], valores en caso de alternativas
      "answers": [ arreglo tiene respuesta y paso siguente
        {
          "answer": [ arreglo de respuestas varia segun el tipo de paso el como se escribe
            "1",
            "1",
            "1",
            "1"
          ],
          "nextStep": "1" necesario id del siguente paso valor = -1 si es que es el ultimo paso
        }
      ],
      "summary": "1)Luego se comprueban valores del conjunto", resumen del paso 
      "correctMsg": "La representacion esta correcta",	mensaje de exito de resolucion del paso
      "incorrectMsg": "Compruebe su respuesta", mensjae de fallo de resolucion del paso
      "matchingError": [] no he encontrado donde se ocupa
    },
    {
      "KCs": [],
      "hints": [
        {
          "hint": "Debe representar la respuesta como fraccion",
          "hintId": 0
        },
        {
          "hint": "La respuesta es: ",
          "hintId": 1,
          "expression": "0"
        }
      ],
      "stepId": "1",
      "values": [],
      "answers": [
        {
          "answer": [
            "0"
          ],
          "nextStep": "2"
        },
        {
          "answer": [
            "-\\frac{1}{3}"
          ],
          "nextStep": "2"
        },
        {
          "answer": [
            "\\frac{-1}{3}"
          ],
          "nextStep": "2"
        }
      ],
      "summary": "1)Luego se comprueban valores del conjunto",
      "StepType": "SinglePlaceholder",
      "stepTitle": "Paso 2: Resuelva el primer valor de la sucesión, si no es entero, represéntelo como fracción de la forma $\\frac{a}{b}$",
      "correctMsg": "El valor de B1 es correcto",
      "expression": "",
      "incorrectMsg": "Compruebe su respuesta",
      "displayResult": [
        "\\placeholder[a]{}"
      ],
      "matchingError": []
    },
    {
      "KCs": [
        "CalcValSuc"
      ],
      "hints": [
        {
          "hint": "Debes calcular B3 y B4",
          "hintId": 0
        },
        {
          "hint": "Expresa los valores como fraccion",
          "hintId": 1
        },
        {
          "hint": "Los valores son: ",
          "hintId": 0,
          "expression": "-\\frac{3}{5} y \\frac{12}{17}"
        }
      ],
      "stepId": "2",
      "values": [],
      "answers": [
        {
          "answer": [
            "-\\frac{3}{5} ",
            "\\frac{12}{17}"
          ],
          "nextStep": "-1"
        }
      ],
      "summary": "1)Luego se comprueban valores del conjunto",
      "StepType": "MultiplePlaceholders",
      "stepTitle": "Paso 3: Encuentre los primeros 4 términos de la sucesión",
      "correctMsg": "La sucesion corresponde",
      "expression": "",
      "validation": "evaluate",
      "incorrectMsg": "Compruebe su respuesta",
      "displayResult": [
        "0,\\; \\frac{2}{5}  ,\\;   \\placeholder[a]{},\\; \\placeholder[b]{}"
      ],
      "matchingError": []
    }
  ],

}
*/

const stepTypeMapping: { [key: string]: string } = {
  "alternativas": "Alternatives",
  "verdadero/falso": "TrueFalse",
  "singleplaceholder": "SinglePlaceholder",
  "multipleplaceholder": "MultiplePlaceholder",
  "table": "TableStep"
};

export function generarEjercicioJSON(cards: any[], code:string) {
  const ejercicio = {
    title:""||"Titulo por defecto", //titulo del ejercicio distinot al enunciado
    eqc: ""||"Expresion por defecto enunciado",   // expresión opcional, utilizado en algunos ejercicios y en otros no (ejemplo en el de succ1, en otros como uni1 ni siquiera existe el parametro)
    img: "",   // imagen opcional no lo tratamos nostros
    code: code, // código del ejercicio se extrae directamente del modal que se abre al guardar el ejercico (parametro de la funcion)
    meta: {}, // campo necesario, aunque vacío
    text: cards[0].title||"Enunciado por defecto", // texto opcional, texto del enunciado hay ejercicio que lo utilizan otros no, se extraer directamente de la tarjeta enunciado
    type: "lvltutor2", // tipo de implementacion a invocar, estático y obligatorio
    steps: cards.slice(1).map((card, index) => ({ //arreglo de steps con todo lo que tienen que llevar, el slice corta la primera tarjeta que es la del enunciado
      StepType: stepTypeMapping[card.type] || "", // tipo de paso utiliza el map que cree arriba para no tener que cambiar nada en newExercise
      stepTitle: card.title || "Titulo paso por defecto", // título del paso
      stepId: index.toString(), // ID progresivo del paso autogenerado
      displayResult: [card.expression] || ["Expresion por defecto"], // debe ser una lista no entiendo por que, cumple como expresion en los ejercicios de tipo single placeholder, multiple placeholder, alternativas
      expression: card.expression || "Expresion por defecto", // expresión del paso se usa en verdadero y falso, en los de tipo tabla de verdad
      KCs: [card.kcs] || ["kc_por_defecto_no_se_asigno_Kc"], // arreglo de KCs
      hints: (card.hints || []).map((hint: any, hintIndex: number) => ({ // arreglo de hints
        hint: hint.text || "Texto hint por defecto", // texto de la hint
        hintId: hintIndex // ID progresivo de la hint
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
      answers: stepTypeMapping[card.type] === "Alternatives" ?[{"answer":[(card.alternatives?.find((alt: any) => alt.correct)?.text || "")]/*Busca el primer elemento que sea correcto*/, "nextStep": index==cards.length - 2 ? "-1": index+1 /* -1 si es el último paso */}]:"", 
      summary: card.summary || "Resumen por defecto", // resumen del paso
      correctMsg: card.correctMsg || "Mensaje correcto por defecto", // mensaje de éxito
      incorrectMsg: card.incorrectMsg || "Mensaje fallo por defecto", // mensaje de error
      matchingError: card.matchingError || [] // no he encontrado donde se ocupa no entie do para que es
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
