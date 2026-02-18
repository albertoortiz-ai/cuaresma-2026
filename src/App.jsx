import { useState, useEffect, useRef } from "react";

// ─── DATOS ───────────────────────────────────────────────────────────────────

const LENT_START = new Date("2025-03-05");

const LENT_DAYS = [
  { day:1, fecha:"5 Mar", titulo:"Miércoles de Ceniza", evangelio:"Mt 6, 1-6.16-18", santo:"San Juan José de la Cruz", mortificacion:"Ayuno y abstinencia. Ofrece el hambre unida a la Cruz.", color:"#7c3aed" },
  { day:2, fecha:"6 Mar", titulo:"Jueves tras Ceniza", evangelio:"Lc 9, 22-25", santo:"Santa Coleta de Corbie", mortificacion:"Silencio en redes sociales. Hoy: silencio interior.", color:"#6d28d9" },
  { day:3, fecha:"7 Mar", titulo:"Viernes 1ª semana", evangelio:"Mt 9, 14-15", santo:"Santos Perpetua y Felicidad", mortificacion:"Abstinencia. Ofrece la sobriedad en la mesa.", color:"#5b21b6" },
  { day:4, fecha:"8 Mar", titulo:"Sábado 1ª semana", evangelio:"Lc 5, 27-32", santo:"San Juan de Dios", mortificacion:"Un momento de servicio concreto a tu familia hoy.", color:"#4c1d95" },
  { day:5, fecha:"9 Mar", titulo:"1er Domingo de Cuaresma", evangelio:"Lc 4, 1-13", santo:"Santa Francisca Romana", mortificacion:"Contempla las tentaciones de Jesús en el desierto.", color:"#7c3aed" },
  { day:6, fecha:"10 Mar", titulo:"Lunes 1ª semana", evangelio:"Mt 25, 31-46", santo:"San Macario de Jerusalén", mortificacion:"Haz una obra de misericordia corporal hoy.", color:"#6d28d9" },
  { day:7, fecha:"11 Mar", titulo:"Martes 1ª semana", evangelio:"Mt 6, 7-15", santo:"San Eulogio de Córdoba", mortificacion:"Reza el Padre Nuestro muy despacio, palabra a palabra.", color:"#5b21b6" },
  { day:8, fecha:"12 Mar", titulo:"Miércoles 1ª semana", evangelio:"Lc 11, 29-32", santo:"San Gregorio Magno", mortificacion:"Apaga la pantalla 1 hora antes de dormir.", color:"#4c1d95" },
  { day:9, fecha:"13 Mar", titulo:"Jueves 1ª semana", evangelio:"Mt 7, 7-12", santo:"San Rodrigo de Córdoba", mortificacion:"Extiende tu oración 5 minutos hoy.", color:"#7c3aed" },
  { day:10, fecha:"14 Mar", titulo:"Viernes 1ª semana", evangelio:"Mt 5, 20-26", santo:"Santa Matilde de Ringelheim", mortificacion:"Abstinencia. Reconcíliate con alguien si hay distancia.", color:"#6d28d9" },
  { day:11, fecha:"15 Mar", titulo:"Sábado 1ª semana", evangelio:"Mt 5, 43-48", santo:"San Longinos", mortificacion:"Reza por un enemigo o por quien te haya herido.", color:"#5b21b6" },
  { day:12, fecha:"16 Mar", titulo:"2º Domingo de Cuaresma", evangelio:"Lc 9, 28-36", santo:"San Heriberto de Colonia", mortificacion:"Contempla la Transfiguración. ¿Qué quiere mostrarte el Señor?", color:"#7c3aed" },
  { day:13, fecha:"17 Mar", titulo:"Lunes 2ª semana", evangelio:"Lc 6, 36-38", santo:"San Patricio de Irlanda", mortificacion:"Misericordia en el trato. No juzgues hoy a nadie.", color:"#6d28d9" },
  { day:14, fecha:"18 Mar", titulo:"Martes 2ª semana", evangelio:"Mt 23, 1-12", santo:"San Cirilo de Jerusalén", mortificacion:"Humildad concreta: deja que otro tenga razón hoy.", color:"#5b21b6" },
  { day:15, fecha:"19 Mar", titulo:"San José – Solemnidad", evangelio:"Mt 1, 16.18-21.24", santo:"San José, Esposo de la Virgen", mortificacion:"Acude a José como padre. Pídele que cuide tu familia.", color:"#b45309" },
  { day:16, fecha:"20 Mar", titulo:"Jueves 2ª semana", evangelio:"Lc 16, 19-31", santo:"San Cutberto", mortificacion:"¿Cómo usas los bienes materiales? Una limosna hoy.", color:"#7c3aed" },
  { day:17, fecha:"21 Mar", titulo:"Viernes 2ª semana", evangelio:"Mt 21, 33-46", santo:"San Benito de Nursia", mortificacion:"Abstinencia. Medita un momento de la Pasión.", color:"#6d28d9" },
  { day:18, fecha:"22 Mar", titulo:"Sábado 2ª semana", evangelio:"Lc 15, 1-3.11-32", santo:"Santa Catalina de Suecia", mortificacion:"El Hijo Pródigo: prepara tu confesión.", color:"#5b21b6" },
  { day:19, fecha:"23 Mar", titulo:"3er Domingo de Cuaresma", evangelio:"Lc 13, 1-9", santo:"Santa Rebeca Ar-Rayes", mortificacion:"¿Qué frutos da tu vida? Tiempo de conversión.", color:"#7c3aed" },
  { day:20, fecha:"24 Mar", titulo:"Lunes 3ª semana", evangelio:"Lc 4, 24-30", santo:"San Óscar de Bremen", mortificacion:"¿Te avergüenzas de tu fe en el trabajo?", color:"#6d28d9" },
  { day:21, fecha:"25 Mar", titulo:"Anunciación del Señor", evangelio:"Lc 1, 26-38", santo:"La Virgen en la Anunciación", mortificacion:"El Fiat de María. Di también tu sí a Dios.", color:"#b45309" },
  { day:22, fecha:"26 Mar", titulo:"Miércoles 3ª semana", evangelio:"Mt 5, 17-19", santo:"San Braulio de Zaragoza", mortificacion:"Cumple un punto del Plan de Vida descuidado.", color:"#5b21b6" },
  { day:23, fecha:"27 Mar", titulo:"Jueves 3ª semana", evangelio:"Lc 11, 14-23", santo:"San Ruperto de Salzburgo", mortificacion:"Identifica tu defecto capital y atácalo hoy.", color:"#7c3aed" },
  { day:24, fecha:"28 Mar", titulo:"Viernes 3ª semana", evangelio:"Mc 12, 28-34", santo:"San Sixto III", mortificacion:"Abstinencia. ¿A quién debes amar mejor?", color:"#6d28d9" },
  { day:25, fecha:"29 Mar", titulo:"Sábado 3ª semana", evangelio:"Lc 18, 9-14", santo:"San Jonás el Mártir", mortificacion:"Reza sin actitudes de superioridad.", color:"#5b21b6" },
  { day:26, fecha:"30 Mar", titulo:"4º Domingo – Laetare", evangelio:"Lc 15, 1-3.11-32", santo:"Santa Zenobia", mortificacion:"Domingo Laetare: ¡alegría! La Cuaresma nos acerca a Pascua.", color:"#7c3aed" },
  { day:27, fecha:"31 Mar", titulo:"Lunes 4ª semana", evangelio:"Jn 4, 43-54", santo:"San Beniamino", mortificacion:"Ofrece tus preocupaciones de hoy con confianza.", color:"#6d28d9" },
  { day:28, fecha:"1 Abr", titulo:"Martes 4ª semana", evangelio:"Jn 5, 1-16", santo:"San Hugo de Grenoble", mortificacion:"«¿Quieres curar?» ¿Quieres de verdad cambiar?", color:"#5b21b6" },
  { day:29, fecha:"2 Abr", titulo:"Miércoles 4ª semana", evangelio:"Jn 5, 17-30", santo:"San Francisco de Paula", mortificacion:"¿Buscas la voluntad de Dios o la tuya?", color:"#7c3aed" },
  { day:30, fecha:"3 Abr", titulo:"Jueves 4ª semana", evangelio:"Jn 5, 31-47", santo:"San Ricardo de Chichester", mortificacion:"¿Buscas la gloria de Dios o la tuya? Examen de intenciones.", color:"#6d28d9" },
  { day:31, fecha:"4 Abr", titulo:"Viernes 4ª semana", evangelio:"Jn 7, 1-2.10.25-30", santo:"San Isidoro de Sevilla", mortificacion:"Abstinencia. Confía en el tiempo de Dios.", color:"#5b21b6" },
  { day:32, fecha:"5 Abr", titulo:"Sábado 4ª semana", evangelio:"Jn 7, 40-53", santo:"San Vicente Ferrer", mortificacion:"¿Juzgas a otros en su fe?", color:"#4c1d95" },
  { day:33, fecha:"6 Abr", titulo:"5º Domingo de Cuaresma", evangelio:"Jn 8, 1-11", santo:"San Celestino I", mortificacion:"Recibe el perdón de Dios. ¡Ve a confesarte!", color:"#7c3aed" },
  { day:34, fecha:"7 Abr", titulo:"Lunes 5ª semana", evangelio:"Jn 8, 12-20", santo:"San Juan Bautista de La Salle", mortificacion:"¿Tu trabajo refleja la luz de Cristo?", color:"#6d28d9" },
  { day:35, fecha:"8 Abr", titulo:"Martes 5ª semana", evangelio:"Jn 8, 21-30", santo:"San Alberto el Grande", mortificacion:"Adoración silenciosa ante el Santísimo.", color:"#5b21b6" },
  { day:36, fecha:"9 Abr", titulo:"Miércoles 5ª semana", evangelio:"Jn 8, 31-42", santo:"Santa María Cleofás", mortificacion:"¿Qué mentira (pequeña) debo abandonar?", color:"#7c3aed" },
  { day:37, fecha:"10 Abr", titulo:"Jueves 5ª semana", evangelio:"Jn 8, 51-59", santo:"San Ezequiel el Profeta", mortificacion:"Humíllate ante la eternidad de Dios.", color:"#6d28d9" },
  { day:38, fecha:"11 Abr", titulo:"Viernes 5ª semana", evangelio:"Jn 10, 31-42", santo:"San Estanislao de Cracovia", mortificacion:"Abstinencia. Vía Crucis completo hoy.", color:"#5b21b6" },
  { day:39, fecha:"12 Abr", titulo:"Sábado 5ª semana", evangelio:"Jn 11, 45-57", santo:"San Zenón de Verona", mortificacion:"Prepara tu corazón: silencio y recogimiento.", color:"#4c1d95" },
  { day:40, fecha:"13 Abr", titulo:"Domingo de Ramos", evangelio:"Lc 19, 28-40", santo:"San Hermenegildo", mortificacion:"Entra en Jerusalén con Cristo.", color:"#b45309" },
];

const VIA_CRUCIS = [
  { num:1, titulo:"Jesús es condenado a muerte", meditacion:"Pilato sabe que Jesús es inocente pero cede al miedo. ¿Cuántas veces callas la verdad por miedo al qué dirán? Jesús acepta la injusticia en silencio por amor a ti.", oracion:"Señor, dame valentía para defender la verdad aunque cueste. Perdona mis silencios cobardes." },
  { num:2, titulo:"Jesús carga con la Cruz", meditacion:"La Cruz no es castigo sino instrumento de amor. Jesús la abraza. En tu vida ordinaria —trabajo, familia— hay cruces cotidianas. No las rehúyas: ábrazalas con Él.", oracion:"Jesús, enséñame a abrazar mis cruces con alegría, unidas a las tuyas." },
  { num:3, titulo:"Jesús cae por primera vez", meditacion:"El Hijo de Dios, exhausto, cae. Y se levanta. Tus caídas y pecados no son el final. Lo que importa es levantarse. San Josemaría: 'Tropezaste: ¿y qué? Levántate y sigue.'", oracion:"En mis caídas, dame la gracia de volver a Ti. No me quedo en el suelo." },
  { num:4, titulo:"Jesús encuentra a su Madre", meditacion:"María no pudo evitarle el dolor, pero estuvo ahí. Su presencia fue todo. ¿Das tu presencia a los que sufren cerca de ti, o solo consejos? A veces basta con estar.", oracion:"María, enséñame a acompañar a los que sufren como tú acompañaste a tu Hijo." },
  { num:5, titulo:"El Cireneo ayuda a Jesús", meditacion:"Simón no quería cargar la Cruz. Le obligaron. Pero al hacerlo, tocó a Cristo. Hay personas que te piden ayuda en momentos incómodos. Ese encuentro forzado es un encuentro con Jesús.", oracion:"Jesús, ayúdame a ver tu rostro en quien necesita mi ayuda hoy." },
  { num:6, titulo:"La Verónica enjuga el rostro de Jesús", meditacion:"Un gesto pequeño, sin protocolo. Solo amor en acción. Verónica no cambió el curso de la Pasión, pero consoló a Cristo. Tus pequeños gestos de bondad consuelan a Cristo en los demás.", oracion:"Dame ojos para ver dónde puedo consolar a Cristo en mis hermanos." },
  { num:7, titulo:"Jesús cae por segunda vez", meditacion:"Segunda caída. ¿Tienes algún pecado al que vuelves una y otra vez? No te desanimes: la misericordia de Dios es más grande que tu miseria. Prepara tu confesión.", oracion:"Señor, me pesa haber vuelto a caer. Confío en tu misericordia sin límites." },
  { num:8, titulo:"Jesús consuela a las mujeres", meditacion:"Jesús, agotado, se detiene a consolar a otros. Su amor no se agota aunque Él esté al límite. ¿Cómo tratas a tu familia cuando estás cansado?", oracion:"Jesús, cuando esté agotado, que mi amor por los demás no se apague." },
  { num:9, titulo:"Jesús cae por tercera vez", meditacion:"Tres veces en el suelo. Y cada vez se levanta. La perseverancia no es no caer: es levantarse siempre. Tu santidad se mide por tu obstinación en levantarte.", oracion:"Dame, Señor, la gracia de la perseverancia. Que nunca me rinda." },
  { num:10, titulo:"Jesús es despojado de sus vestiduras", meditacion:"Le quitan todo. Queda desnudo, humillado. En algún momento de tu vida también te lo quitaron todo. Jesús estuvo ahí antes que tú.", oracion:"Señor, en mis momentos de humillación, ayúdame a unirlos a los tuyos." },
  { num:11, titulo:"Jesús es clavado en la Cruz", meditacion:"Los clavos son el sonido del amor de Dios. Cada clavo es un sí definitivo al Padre. ¿Hay algo en tu vida a lo que necesitas decirle un sí definitivo a Dios?", oracion:"Jesús, clavado por amor, ayúdame a dar mi fiat sin condiciones." },
  { num:12, titulo:"Jesús muere en la Cruz", meditacion:"«Todo está cumplido.» Desde la Cruz nos da a su Madre. Nada queda para Él: todo para nosotros. Este es el amor. Contempla en silencio. Solo gratitud.", oracion:"Señor, gracias. Gracias por morir por mí. Que nunca olvide lo que esto costó." },
  { num:13, titulo:"Jesús es bajado de la Cruz", meditacion:"María sostiene el cuerpo de su Hijo. La Pietà. El momento más silencioso de la historia. Lleva a María tus duelos, lo que has perdido. Ella lo sostiene todo.", oracion:"María, sostén en tus brazos todo lo que yo no puedo sostener." },
  { num:14, titulo:"Jesús es sepultado", meditacion:"El silencio del sábado santo. Parece que todo ha terminado. Pero el sepulcro no es el final: es el umbral de la Resurrección. En tus momentos de oscuridad, recuerda: el domingo viene.", oracion:"Señor, en mis noches oscuras, ayúdame a esperar tu Resurrección." },
];

const MISTERIOS_ROSARIO = {
  gozosos: {
    nombre:"Misterios Gozosos", dias:"Lunes y Sábado", color:"#1e40af",
    misterios:[
      { num:1, titulo:"La Anunciación", fruto:"Humildad", meditacion:"El ángel Gabriel saluda a María. Ella dice su fiat. El Verbo se hace carne. La humildad de Dios que se hace pequeño; la humildad de María que se deja llenar." },
      { num:2, titulo:"La Visitación", fruto:"Caridad con el prójimo", meditacion:"María va corriendo a servir a Isabel. Lleva a Cristo en su seno y lo lleva a los demás. Cada vez que sirves a otros, llevas a Cristo." },
      { num:3, titulo:"El Nacimiento", fruto:"Pobreza y desapego", meditacion:"Dios nace en una cueva. Elige la pobreza, el frío, la marginalidad. ¿Qué apego a lo material te aleja de Él?" },
      { num:4, titulo:"La Presentación en el Templo", fruto:"Obediencia y pureza", meditacion:"Simeón y Ana esperan. El anciano toma al Niño en brazos: 'Mis ojos han visto tu salvación.' ¿Estás disponible para reconocer a Cristo cuando viene?" },
      { num:5, titulo:"El Niño perdido y hallado", fruto:"Amor a la vida interior", meditacion:"Tres días buscándole. 'No sabíais que debo estar en las cosas de mi Padre.' ¿Dónde buscas a Jesús cuando le pierdes?" },
    ]
  },
  dolorosos: {
    nombre:"Misterios Dolorosos", dias:"Martes y Viernes", color:"#7f1d1d",
    misterios:[
      { num:1, titulo:"La Agonía en el Huerto", fruto:"Contrición", meditacion:"'Padre, si es posible, que pase este cáliz.' El sudor de sangre. La soledad de Getsemaní. Jesús pasa por el miedo para enseñarte a pasar por el tuyo." },
      { num:2, titulo:"La Flagelación", fruto:"Mortificación", meditacion:"Cada latigazo es un pecado humano. Cada latigazo es amor que soporta. Ofrece hoy tus pequeñas mortificaciones unidas a las heridas de Cristo." },
      { num:3, titulo:"La Coronación de Espinas", fruto:"Humildad", meditacion:"Le coronan de burla. Pero es el Rey del universo. Las humillaciones que tú sufres, Él las santificó primero." },
      { num:4, titulo:"Jesús carga con la Cruz", fruto:"Paciencia", meditacion:"La Cruz sobre los hombros doloridos. Paso a paso hacia el Calvario. Así también tú: un paso detrás de otro, cargando lo tuyo." },
      { num:5, titulo:"La Crucifixión y Muerte", fruto:"Salvación y perseverancia", meditacion:"'Todo está cumplido.' Desde la Cruz, te mira. Sabe tu nombre. Murió por ti específicamente. Esto no es poesía: es historia." },
    ]
  },
  gloriosos: {
    nombre:"Misterios Gloriosos", dias:"Miércoles y Domingos", color:"#166534",
    misterios:[
      { num:1, titulo:"La Resurrección", fruto:"Fe", meditacion:"El sepulcro vacío. María Magdalena llora; Jesús la llama por su nombre. Te llama a ti por tu nombre. La muerte no tiene la última palabra." },
      { num:2, titulo:"La Ascensión", fruto:"Esperanza", meditacion:"Jesús sube al cielo. Los apóstoles se quedan mirando. 'No os dejaré huérfanos.' Nuestra patria es el cielo; todo lo demás es camino." },
      { num:3, titulo:"Pentecostés", fruto:"Amor a la Iglesia", meditacion:"El Espíritu desciende como fuego. La Iglesia nace. El mismo Espíritu vive en ti desde el bautismo. ¿Le dejas actuar?" },
      { num:4, titulo:"La Asunción de María", fruto:"Gracia de la muerte santa", meditacion:"María entra en cuerpo y alma al cielo. Es la primicia de lo que espera a todos los que aman a Dios. Tu cuerpo también resucitará." },
      { num:5, titulo:"La Coronación de María", fruto:"Perseverancia", meditacion:"María, Reina del cielo y de la tierra. Nuestra Madre. Acude a ella siempre, especialmente cuando la lucha arrecia." },
    ]
  },
  luminosos: {
    nombre:"Misterios Luminosos", dias:"Jueves", color:"#b45309",
    misterios:[
      { num:1, titulo:"El Bautismo en el Jordán", fruto:"Apertura al Espíritu Santo", meditacion:"'Este es mi Hijo amado.' También tú eres hijo de Dios desde el bautismo. ¿Vives como quien sabe que es hijo del Rey?" },
      { num:2, titulo:"Las Bodas de Caná", fruto:"A Jesús por María", meditacion:"'Haced lo que Él os diga.' María siempre apunta hacia su Hijo. La devoción mariana no es fin en sí misma: lleva a Cristo." },
      { num:3, titulo:"El Anuncio del Reino", fruto:"Conversión", meditacion:"'Convertíos y creed en el Evangelio.' La conversión no es un momento: es una dirección permanente. ¿Sigues convirtiendo hoy?" },
      { num:4, titulo:"La Transfiguración", fruto:"Deseo de santidad", meditacion:"Pedro, Santiago y Juan ven la gloria de Cristo. Por un momento, la divinidad brilla. Eso te espera a ti también." },
      { num:5, titulo:"La Institución de la Eucaristía", fruto:"Adoración eucarística", meditacion:"'Tomad y comed.' Se queda. Cada Misa renueva el Calvario. La Eucaristía es el centro de la vida cristiana." },
    ]
  }
};

const EXAMENES = [
  "¿He dedicado tiempo de calidad a la oración hoy?",
  "¿He tratado a mi familia con amor y paciencia?",
  "¿He ofrecido mis trabajos y contratiempos a Dios?",
  "¿He sido honesto en mi trabajo y relaciones?",
  "¿He buscado la santificación en lo ordinario?",
  "¿He ayudado a alguien sin esperar nada a cambio?",
  "¿He mantenido la caridad en mis conversaciones?",
  "¿He cumplido mis compromisos del Plan de Vida?",
  "¿He buscado a Cristo en las personas que me rodean?",
  "¿He pedido perdón cuando he fallado?",
];

const HOMILIAS_ECP = [
  {
    titulo: "La Cuaresma, tiempo de conversión",
    numero: "n. 57-72 en «Es Cristo que Pasa»",
    tema: "Cuaresma",
    resumen: "San Josemaría presenta la Cuaresma no como un tiempo de tristeza sino de esperanza activa: 'La Cuaresma es un tiempo propicio para que el cristiano se decida a rectificar su vida, a tomar en serio el seguimiento de Cristo.' Insiste en que la penitencia no es fin en sí misma sino camino de amor.",
    citas: [
      "«La penitencia cristiana no es pesimismo ni tristeza. Es precisamente lo contrario: es el camino para encontrar la alegría.»",
      "«La mortificación es el reverso del amor. No se mortifica quien no ama, porque no tiene motivos para sacrificarse.»",
    ],
    url: "https://opusdei.org/es-es/article/homilia-la-cuaresma/",
    color: "#4c1d95"
  },
  {
    titulo: "El dolor, parte del camino cristiano",
    numero: "Homilía sobre el sufrimiento",
    tema: "Cuaresma",
    resumen: "Con gran realismo humano, san Josemaría aborda el dolor como realidad de la vida cristiana. El sufrimiento unido a la Cruz de Cristo no es inútil: se convierte en fuente de gracia para el alma y para los demás.",
    citas: [
      "«No hay amor sin cruz, ni cruz sin amor. Si quieres seguir a Cristo de verdad, tendrás que cargar con tu cruz.»",
      "«El cristiano que sufre y ofrece no desperdicia su dolor: lo convierte en oración y en apostolado silencioso.»",
    ],
    url: "https://opusdei.org/es-es/article/homilia-el-dolor-parte-del-camino-cristiano/",
    color: "#7c3aed"
  },
  {
    titulo: "Hacia la santidad",
    numero: "n. 1-10 en «Es Cristo que Pasa»",
    tema: "Cuaresma",
    resumen: "La llamada universal a la santidad, corazón del espíritu del Opus Dei. Todo cristiano, en su vida ordinaria, está llamado a ser santo. La Cuaresma es el momento de renovar esa vocación con seriedad y alegría.",
    citas: [
      "«La santidad no es para unos pocos privilegiados: es la vocación de todos los bautizados, en medio del mundo.»",
      "«Santificad el trabajo ordinario; santificaos en el trabajo ordinario; santificad a los demás mediante el trabajo ordinario.»",
    ],
    url: "https://opusdei.org/es-es/article/homilia-hacia-la-santidad/",
    color: "#1e40af"
  },
  {
    titulo: "El Padre Dios",
    numero: "n. 83-111 en «Es Cristo que Pasa»",
    tema: "Cuaresma",
    resumen: "Una de las homilías más hermosas de san Josemaría sobre la paternidad de Dios. La Cuaresma nos recuerda que somos hijos pródigos que volvemos al Padre. El examen de conciencia y la confesión son el camino del regreso.",
    citas: [
      "«Dios es Padre. No un juez severo que espera para condenar, sino un Padre que espera para perdonar y abrazar.»",
      "«La filiación divina es la base de la vida espiritual. Saber que soy hijo de Dios lo cambia todo.»",
    ],
    url: "https://opusdei.org/es-es/article/homilia-el-padre-dios/",
    color: "#b45309"
  },
  {
    titulo: "La Eucaristía, misterio de fe y de amor",
    numero: "n. 83-94 en «Es Cristo que Pasa»",
    tema: "Semana Santa",
    resumen: "El Jueves Santo y la institución de la Eucaristía son el centro de esta homilía. San Josemaría invita a vivir cada Misa como si fuera la primera, la última, la única. La Eucaristía es el corazón de la vida cristiana.",
    citas: [
      "«Asistir a la Misa con fe es participar en el Calvario. No como espectadores, sino como miembros del Cuerpo de Cristo.»",
      "«La Misa es el centro y la raíz de la vida espiritual del cristiano. Todo lo demás gira en torno a ella.»",
    ],
    url: "https://opusdei.org/es-es/article/homilia-la-eucaristia-misterio-de-fe-y-de-amor/",
    color: "#b45309"
  },
  {
    titulo: "El esplendor de la Cruz",
    numero: "n. 95-127 en «Es Cristo que Pasa»",
    tema: "Semana Santa",
    resumen: "La homilía del Viernes Santo por excelencia. San Josemaría contempla la Cruz no como derrota sino como victoria del amor. 'La Cruz no es el fracaso de Cristo sino la máxima expresión de su amor.' Para el cristiano, la Cruz es camino, no obstáculo.",
    citas: [
      "«Que la Cruz sea siempre tu apoyo y tu camino, nunca tu obstáculo ni tu vergüenza.»",
      "«El cristiano debe estar enamorado de la Cruz, porque está enamorado de Cristo.»",
    ],
    url: "https://opusdei.org/es-es/article/homilia-el-esplendor-de-la-cruz/",
    color: "#7f1d1d"
  },
  {
    titulo: "Cristo presente en los cristianos",
    numero: "n. 103-127 en «Es Cristo que Pasa»",
    tema: "Semana Santa",
    resumen: "Homilía sobre la Resurrección y sus consecuencias para la vida ordinaria. Cristo vive y actúa en los cristianos. La Pascua no es un recuerdo histórico: es una realidad presente que transforma el trabajo, la familia y el apostolado.",
    citas: [
      "«La Resurrección de Cristo es el fundamento de nuestra fe. Sin ella, todo se desmorona.»",
      "«Después de Pascua, el cristiano vive como quien sabe que la muerte ha sido vencida. Y eso se nota.»",
    ],
    url: "https://opusdei.org/es-es/article/homilia-cristo-presente-en-los-cristianos/",
    color: "#166534"
  },
  {
    titulo: "La vida de oración",
    numero: "n. 119-134 en «Es Cristo que Pasa»",
    tema: "Cuaresma",
    resumen: "La oración como respiración del alma. San Josemaría insiste en la oración mental como conversación de amor con Dios, accesible a todos, no solo a los contemplativos. Durante la Cuaresma, es momento de profundizar en este diálogo.",
    citas: [
      "«La oración no es un deber penoso: es una conversación de amor con quien sabemos que nos quiere.»",
      "«Un cuarto de hora de oración al día puede cambiarlo todo. Empieza hoy.»",
    ],
    url: "https://opusdei.org/es-es/article/homilia-la-vida-de-oracion/",
    color: "#6d28d9"
  },
];

const SEMANA_SANTA = [
  { dia:"Domingo de Ramos", fecha:"13 Abr", color:"#7c3aed", icono:"🌿", espiritu:"Entramos en Jerusalén con Cristo. La multitud le aclama rey, pero en pocos días le abandonará. ¿Soy fiel a Cristo cuando va bien, y también cuando cuesta?", liturgia:"Bendición de ramos · Procesión · Pasión según Lucas (Lc 22-23)", propuesta:"Conserva tu ramo en casa todo el año como recuerdo de tu fidelidad. Lee despacio la Pasión según Lucas.", oracion:"Señor, que mi 'Hosanna' no se convierta en silencio cuando te persiguen.", mortificacion:"Ayuno voluntario, ofrecido por alguien que no conoce a Cristo." },
  { dia:"Lunes Santo", fecha:"14 Abr", color:"#6d28d9", icono:"🕯️", espiritu:"María unge a Jesús con perfume costoso. Judas protesta. ¿En qué gastas lo mejor de ti? ¿Le das a Dios lo que te sobra o lo que más vale?", liturgia:"Is 42, 1-7 · Jn 12, 1-11", propuesta:"Haz algo 'derrochador' por Dios: oración más larga, silencio más profundo, visita al Santísimo.", oracion:"Que no regateé mi amor, Señor. Que te dé lo mejor.", mortificacion:"Silencio en redes sociales todo el día." },
  { dia:"Martes Santo", fecha:"15 Abr", color:"#5b21b6", icono:"⚔️", espiritu:"Jesús anuncia la traición de Judas y la negación de Pedro. Dos formas de fallar: una se hunde en la desesperación, la otra llora y vuelve. ¿Cómo respondes tú a tus fallos?", liturgia:"Is 49, 1-6 · Jn 13, 21-33.36-38", propuesta:"Examina si hay algo que te aleje de Dios silenciosamente. Prepara tu confesión.", oracion:"Señor, que como Pedro, llore mis negaciones y vuelva a Ti.", mortificacion:"No te quejes de nada hoy. Ofrece todo en silencio." },
  { dia:"Miércoles Santo", fecha:"16 Abr", color:"#4c1d95", icono:"🌑", espiritu:"El día del silencio antes de la tormenta. Jesús se prepara. El Opus Dei invita a más recogimiento interior, como si el tiempo se hiciera más lento y sagrado.", liturgia:"Is 50, 4-9 · Mt 26, 14-25", propuesta:"Reduce al mínimo el ruido: pantallas, música, conversaciones innecesarias. Deja espacio al silencio.", oracion:"Señor, recógeme en Ti. Que este silencio sea encuentro.", mortificacion:"Ayuno de entretenimiento: sin series, redes, noticias." },
  { dia:"Jueves Santo", fecha:"17 Abr", color:"#b45309", icono:"🍞", espiritu:"La Última Cena. El lavatorio de pies. La institución de la Eucaristía. Jesús dice: 'Haced esto en memoria mía.' Esta noche, contempla el don de la Misa.", liturgia:"Ex 12, 1-14 · 1Cor 11, 23-26 · Jn 13, 1-15 · Misa Vespertina", propuesta:"Asiste a la Misa vespertina y a la adoración nocturna. Pasa tiempo ante el Santísimo expuesto. 'Velad conmigo.'", oracion:"Gracias, Señor, por quedarte. Por la Eucaristía. Por el sacerdocio.", mortificacion:"Ayuno y abstinencia voluntaria. Vela al menos 30 minutos ante el Santísimo." },
  { dia:"Viernes Santo", fecha:"18 Abr", color:"#7f1d1d", icono:"✝️", espiritu:"El día más sagrado del año. Cristo muere por ti. No hay Misa: solo la Liturgia de la Pasión y el silencio. San Josemaría amaba profundamente este día.", liturgia:"Is 52-53 · Hb 4, 14-16 · Jn 18-19 · Veneración de la Cruz", propuesta:"Vía Crucis. Liturgia de la Pasión. Ayuno y abstinencia. Silencio de 12 a 3pm si puedes.", oracion:"Señor, que nunca trivialice lo que costó tu amor. Gracias.", mortificacion:"Ayuno estricto. Abstinencia. Silencio interior todo el día." },
  { dia:"Sábado Santo", fecha:"19 Abr", color:"#1e293b", icono:"🌑", espiritu:"El gran silencio. El sábado santo es el día en que Dios parece ausente. María sola mantiene la fe. ¿Puedes vivir en la fe cuando no sientes nada?", liturgia:"Vigilia Pascual por la noche · Bautismos · Primera Eucaristía pascual", propuesta:"Cuida el silencio hasta la Vigilia. Por la noche, asiste a la Vigilia Pascual: es la noche más bella del año.", oracion:"María, danos tu fe inquebrantable cuando todo parece perdido.", mortificacion:"Silencio y recogimiento hasta la Vigilia. Sin celebraciones prematuras." },
  { dia:"Domingo de Resurrección", fecha:"20 Abr", color:"#d97706", icono:"☀️", espiritu:"¡Alleluia! Cristo ha resucitado. Todo cambia. La Cuaresma termina. Tu vida ordinaria tiene ahora una luz nueva. Sal a vivirla.", liturgia:"Hch 10, 34-43 · Col 3, 1-4 · Jn 20, 1-9", propuesta:"Llama a alguien que esté solo. Comparte la alegría de la Pascua. Comulga con profundidad.", oracion:"Señor resucitado, renueva mi vida. Que la Pascua cambie cómo trabajo, amo y sirvo.", mortificacion:"Hoy no hay mortificación penitencial. La alegría es el deber del día." },
];

const MISAS_CIUDADES = [
  { ciudad:"Madrid", iglesias:[
    { nombre:"Catedral de la Almudena", horarios:"Lu-Vi: 9h, 10h, 12h, 18h, 19h30 · Sáb: 10h, 12h, 18h, 19h30 · Dom: 9h, 10h30, 12h, 13h, 17h, 19h", dominio:"madridreligioso.org" },
    { nombre:"San Jerónimo el Real", horarios:"Lu-Vi: 9h, 12h, 19h · Sáb-Dom: 9h, 12h, 13h, 19h", dominio:"sanjeronimomadrid.com" },
    { nombre:"Parroquia del Espíritu Santo (Opus Dei)", horarios:"Lu-Sáb: 8h, 10h, 14h, 19h · Dom: 9h, 11h, 13h, 19h", dominio:"opusdei.org" },
    { nombre:"Capilla de la Santa Cruz (Opus Dei, Serrano)", horarios:"Lu-Vi: 7h30, 9h, 14h, 19h · Sáb: 8h, 10h, 14h, 19h · Dom: 9h, 11h, 13h, 20h", dominio:"opusdei.org" },
  ]},
  { ciudad:"Barcelona", iglesias:[
    { nombre:"Sagrada Familia", horarios:"Lu-Vi: 9h, 10h, 12h, 19h · Sáb: 9h, 10h, 12h, 19h · Dom: 9h, 10h, 11h, 12h, 13h, 19h", dominio:"sagradafamilia.org" },
    { nombre:"Catedral de Barcelona", horarios:"Lu-Vi: 8h30, 9h30, 11h, 12h, 13h, 18h, 19h · Dom: 9h30, 10h30, 11h30, 12h30, 13h, 18h, 19h", dominio:"catedralbcn.org" },
    { nombre:"Centro del Opus Dei – Barcelona", horarios:"Lu-Sáb: 8h, 9h30, 14h, 20h · Dom: 9h30, 11h, 13h, 20h", dominio:"opusdei.org" },
  ]},
  { ciudad:"Sevilla", iglesias:[
    { nombre:"Catedral de Sevilla", horarios:"Lu-Vi: 9h, 10h, 12h, 19h · Sáb-Dom: 9h, 10h, 11h30, 13h, 19h30", dominio:"catedraldesevilla.es" },
    { nombre:"Parroquia del Salvador", horarios:"Lu-Vi: 9h, 12h, 19h · Dom: 10h, 12h, 13h, 19h", dominio:"iglesilasalvadorsevilla.es" },
  ]},
  { ciudad:"Valencia", iglesias:[
    { nombre:"Catedral Metropolitana de Valencia", horarios:"Lu-Vi: 9h, 10h, 12h, 19h · Dom: 10h, 11h30, 12h30, 13h30, 19h", dominio:"catedraldevalencia.es" },
    { nombre:"Basílica de la Virgen de los Desamparados", horarios:"Lu-Dom: 8h, 9h30, 11h, 12h30, 18h30, 20h", dominio:"basilicadesamparados.org" },
  ]},
  { ciudad:"Pamplona", iglesias:[
    { nombre:"Catedral de Pamplona", horarios:"Lu-Vi: 9h, 11h, 19h · Dom: 9h, 11h, 12h30, 19h", dominio:"catedralnapamplona.com" },
    { nombre:"Parroquia del Espíritu Santo (Opus Dei)", horarios:"Lu-Sáb: 8h, 14h, 19h · Dom: 9h, 11h, 13h, 19h", dominio:"opusdei.org" },
  ]},
  { ciudad:"Bilbao", iglesias:[
    { nombre:"Catedral de Santiago", horarios:"Lu-Vi: 9h, 12h, 19h30 · Dom: 9h, 11h, 12h30, 19h30", dominio:"catedraldesantiago.eus" },
  ]},
  { ciudad:"Zaragoza", iglesias:[
    { nombre:"Basílica del Pilar", horarios:"Lu-Dom: 8h (cada hora hasta las 20h30) · Misas especiales en festividades", dominio:"basilicadelpilar.es" },
  ]},
  { ciudad:"Granada", iglesias:[
    { nombre:"Catedral de Granada", horarios:"Lu-Sáb: 9h, 11h, 13h, 19h · Dom: 9h, 10h30, 12h, 13h, 19h", dominio:"catedralGranada.com" },
  ]},
];

const CAMINO_QUOTES = [
  { num:418, texto:"No te desanimes. No te abandones a la tristeza. Si te dominas, si te niegas en todo lo que puedas, sin exageración, pero con constancia, tendrás paz." },
  { num:213, texto:"Lleva la Presencia de Dios. Eso solo hace santos." },
  { num:82, texto:"¿Eres piedra angular de tu ambiente? —Si lo eres, no es para que el ambiente te aplaste, sino para que tú lo levantes." },
  { num:291, texto:"La Cruz en alto: así tienes que defenderla y propagarla." },
  { num:855, texto:"El optimismo apostólico no es una actitud beata. Es la lógica consecuencia de tu fe." },
  { num:278, texto:"Muchos se pierden porque no tienen nadie que rece por ellos." },
  { num:774, texto:"Trabaja. —No digas: mañana haré penitencia. Comienza ahora." },
  { num:58, texto:"El camino del alma: Oración, Mortificación, Acción de gracias." },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function getLentDay() {
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(LENT_START); start.setHours(0,0,0,0);
  const diff = Math.floor((today - start)/(1000*60*60*24));
  return (diff >= 0 && diff < 40) ? diff : 0;
}

const S = {
  wrap: { minHeight:"100vh", background:"#0f0520", color:"#f0e6ff", fontFamily:"'Lora', Georgia, serif", position:"relative" },
  card: { background:"#120820", border:"1px solid #2d0b5c", borderRadius:16, padding:"22px 22px" },
  label: { fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#c084fc", marginBottom:8 },
  prose: { fontFamily:"'Crimson Pro', serif", fontSize:15, lineHeight:1.85, color:"#e2d0ff" },
  btn: (active, col="#5b21b6") => ({ padding:"8px 16px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontFamily:"'Lora', serif", fontWeight:600, background: active ? col : "transparent", color: active ? "#fff" : "#a78bca", border:`1px solid ${active ? col : "#3d1a6e"}`, transition:"all 0.2s" }),
  aiBtn: { background:"#5b21b6", border:"none", borderRadius:10, padding:"9px 18px", color:"#fff", cursor:"pointer", fontSize:12, fontFamily:"'Lora', serif" },
};

function AICard({ prompt, label }) {
  const [text, setText] = useState(""); const [loading, setLoading] = useState(false);
  async function gen() {
    setLoading(true); setText("");
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages:[{role:"user", content:prompt}] }) });
      const d = await r.json();
      setText(d.content?.map(c=>c.text||"").join("")||"Error.");
    } catch { setText("Error al conectar."); }
    setLoading(false);
  }
  return (
    <div style={{...S.card, marginBottom:16}}>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14}}>
        <div style={S.label}>{label}</div>
        <button onClick={gen} disabled={loading} style={{...S.aiBtn, opacity:loading?0.7:1}}>{loading?"Meditando...":text?"Nueva ✦":"Generar ✦"}</button>
      </div>
      {loading && <div style={{textAlign:"center",padding:"24px 0",color:"#7c6aa0"}}><div style={{fontSize:24,marginBottom:8}}>✦</div><div style={{fontSize:13,fontStyle:"italic"}}>Preparando...</div></div>}
      {text && !loading && <p style={{margin:0,...S.prose}}>{text}</p>}
      {!text && !loading && <p style={{margin:0,fontSize:13,color:"#4a3560",fontStyle:"italic",textAlign:"center",padding:"16px 0"}}>Pulsa para generar.</p>}
    </div>
  );
}

// ─── TABS CONTENT ─────────────────────────────────────────────────────────────

function TabHoy({ dayData, todayIdx, selectedDay }) {
  const [checked, setChecked] = useState({});
  const tc = k => setChecked(p=>({...p,[k]:!p[k]}));
  const prompt = `Eres director espiritual del Opus Dei hablando con un supernumerario(a) casado/a con trabajo y familia. Día ${dayData.day} de Cuaresma: ${dayData.titulo}. Evangelio: ${dayData.evangelio}. Escribe una reflexión de 200 palabras, cálida y práctica, estilo san Josemaría. Conecta a la vida ordinaria y el trabajo. Sin subtítulos, prosa fluida.`;
  return (
    <div>
      <div style={{...S.card, background:`linear-gradient(135deg,${dayData.color}22,#120820)`, border:`1px solid ${dayData.color}55`, marginBottom:16}}>
        <div style={S.label}>Liturgia del día</div>
        <h2 style={{margin:"0 0 6px",fontSize:21,fontWeight:700}}>{dayData.titulo}</h2>
        <div style={{fontSize:13,color:"#a78bca",fontStyle:"italic",fontFamily:"'Crimson Pro',serif"}}>Evangelio: {dayData.evangelio}</div>
        <div style={{fontSize:12,color:"#7c6aa0",marginTop:4}}>Santo: {dayData.santo}</div>
      </div>
      <div style={{...S.card, borderLeft:"3px solid #7c3aed", marginBottom:16}}>
        <div style={S.label}>⚔️ Mortificación del día</div>
        <p style={{margin:"0 0 12px",...S.prose,fontStyle:"italic"}}>"{dayData.mortificacion}"</p>
        <button onClick={()=>tc("mort")} style={{...S.btn(checked.mort,"#7c3aed")}}>{checked.mort?"✓ Ofrecida a Dios":"Marcar como ofrecida"}</button>
      </div>
      <div style={{...S.card, marginBottom:16}}>
        <div style={S.label}>Plan de vida · Hoy</div>
        {[["or","Oración mental (15 min)"],["mi","Santa Misa"],["ro","Rosario"],["le","Lectura espiritual"],["ex","Examen de conciencia"],["an","Ángelus / Regina Coeli"],["of","Ofrecimiento de obras"]].map(([k,l])=>(
          <div key={k} onClick={()=>tc(k)} style={{display:"flex",alignItems:"center",gap:12,padding:"9px 0",borderBottom:"1px solid #1e0d38",cursor:"pointer"}}>
            <div style={{width:20,height:20,borderRadius:5,border:"1px solid #6d28d9",background:checked[k]?"#7c3aed":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{checked[k]&&"✓"}</div>
            <span style={{...S.prose,fontSize:14,textDecoration:checked[k]?"line-through":"none",color:checked[k]?"#c084fc":"#d8c4f0"}}>{l}</span>
          </div>
        ))}
      </div>
      <AICard prompt={prompt} label="🕊️ Reflexión del día" />
      <div style={S.card}>
        <div style={{...S.label,marginBottom:14}}>📺 Recursos de hoy</div>
        {[["🎵","Misa del día – Vatican News ES","https://www.youtube.com/@vaticannews-es"],["🎙️","Evangelio comentado – opusdei.org","https://opusdei.org/es-es/gospel-thought/"],["📖","Artículos de espiritualidad – Opus Dei","https://opusdei.org/es-es/section/articulos-sobre-espiritualidad/"],["🙏","Vía Crucis de San Josemaría","https://opusdei.org/es-es/article/via-crucis/"]].map(([ic,t,u],i)=>(
          <a key={i} href={u} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",background:"#1a0d30",borderRadius:10,textDecoration:"none",color:"#d8c4f0",marginBottom:8,fontSize:14,fontFamily:"'Crimson Pro',serif"}}>
            <span style={{fontSize:18}}>{ic}</span><span style={{flex:1}}>{t}</span><span style={{color:"#6d28d9"}}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function TabRosario() {
  const [tipo, setTipo] = useState("dolorosos");
  const [misterioActivo, setMisterioActivo] = useState(0);
  const [completados, setCompletados] = useState({});
  const m = MISTERIOS_ROSARIO[tipo];
  const mis = m.misterios[misterioActivo];
  const togComp = i => setCompletados(p=>({...p,[`${tipo}_${i}`]:!p[`${tipo}_${i}`]}));
  return (
    <div>
      <div style={{...S.card, background:`linear-gradient(135deg,${m.color}22,#120820)`, border:`1px solid ${m.color}55`, marginBottom:16}}>
        <div style={S.label}>Santo Rosario</div>
        <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:700}}>{m.nombre}</h2>
        <p style={{margin:0,fontStyle:"italic",color:"#a78bca",fontFamily:"'Crimson Pro',serif",fontSize:14}}>{m.dias}</p>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {Object.entries(MISTERIOS_ROSARIO).map(([k,v])=>(
          <button key={k} onClick={()=>{setTipo(k);setMisterioActivo(0);}} style={{...S.btn(tipo===k,v.color)}}>{v.nombre.split(" ")[1]}</button>
        ))}
      </div>
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {m.misterios.map((_,i)=>(
          <button key={i} onClick={()=>setMisterioActivo(i)} style={{width:36,height:36,borderRadius:"50%",border:`2px solid ${i===misterioActivo?m.color:"#2d0b5c"}`,background:completados[`${tipo}_${i}`]?m.color:i===misterioActivo?"#1e0d38":"transparent",color:i===misterioActivo||completados[`${tipo}_${i}`]?"#fff":"#6d5090",cursor:"pointer",fontSize:13,fontWeight:700}}>
            {completados[`${tipo}_${i}`]?"✓":i+1}
          </button>
        ))}
      </div>
      <div style={{...S.card, border:`1px solid ${m.color}55`, marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <div style={{...S.label,color:m.color}}>Misterio {mis.num}</div>
            <h3 style={{margin:0,fontSize:19,fontWeight:700}}>{mis.titulo}</h3>
            <div style={{fontSize:12,color:"#6d5090",marginTop:3}}>Fruto: {mis.fruto}</div>
          </div>
        </div>
        <p style={{margin:"0 0 14px",...S.prose}}>{mis.meditacion}</p>
        <div style={{background:"#0d0620",borderRadius:10,padding:"12px 14px",borderLeft:`3px solid ${m.color}`}}>
          <div style={{fontSize:11,color:"#6d5090",letterSpacing:1,marginBottom:6}}>ORACIONES</div>
          <div style={{fontSize:13,color:"#a78bca",fontFamily:"'Crimson Pro',serif"}}>1 Padre Nuestro · 10 Ave Marías · 1 Gloria</div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:14,justifyContent:"space-between"}}>
          <button onClick={()=>setMisterioActivo(Math.max(0,misterioActivo-1))} disabled={misterioActivo===0} style={{flex:1,padding:"10px",background:misterioActivo===0?"#0d0620":"#2d0b5c",border:"none",borderRadius:10,color:misterioActivo===0?"#4b5563":"#e2d0ff",cursor:misterioActivo===0?"default":"pointer",fontFamily:"'Lora',serif",fontSize:13}}>← Anterior</button>
          <button onClick={()=>{togComp(misterioActivo);if(misterioActivo<4)setMisterioActivo(misterioActivo+1);}} style={{flex:1,padding:"10px",background:m.color,border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontFamily:"'Lora',serif",fontSize:13}}>{misterioActivo<4?"Siguiente →":"✓ Completar"}</button>
        </div>
      </div>
      <div style={{...S.card,textAlign:"center"}}>
        <div style={{fontSize:13,color:"#4a3560",fontStyle:"italic",fontFamily:"'Crimson Pro',serif",lineHeight:1.8}}>
          «El Rosario es un arma poderosa para vencer al demonio<br/>y para santificar nuestra vida.» — San Josemaría
        </div>
      </div>
    </div>
  );
}

function TabViacrucis() {
  const [est, setEst] = useState(0);
  const [done, setDone] = useState({});
  const e = VIA_CRUCIS[est];
  return (
    <div>
      <div style={{...S.card,background:"linear-gradient(135deg,#1a0000,#120820)",border:"1px solid #7f1d1d",marginBottom:16}}>
        <div style={{...S.label,color:"#fca5a5"}}>Vía Crucis · Cada viernes de Cuaresma</div>
        <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:700}}>Las 14 Estaciones</h2>
        <p style={{margin:0,...S.prose,fontStyle:"italic",color:"#fca5a5",fontSize:13}}>"Te aconsejo que hagas el Vía Crucis cada viernes." — San Josemaría</p>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
        {VIA_CRUCIS.map((_,i)=>(
          <button key={i} onClick={()=>setEst(i)} style={{width:34,height:34,borderRadius:7,border:`1px solid ${i===est?"#ef4444":"#2d0b5c"}`,background:done[i]?"#7f1d1d":i===est?"#2d0000":"#120820",color:i===est||done[i]?"#fca5a5":"#6b7280",cursor:"pointer",fontSize:11,fontWeight:700}}>{done[i]?"✓":i+1}</button>
        ))}
      </div>
      <div style={{...S.card,background:"#100000",border:"1px solid #7f1d1d",marginBottom:14}}>
        <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:18}}>
          <div style={{width:46,height:46,borderRadius:"50%",background:"#7f1d1d",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:"#fca5a5",flexShrink:0}}>{est+1}</div>
          <div>
            <div style={{...S.label,color:"#ef4444"}}>Estación {est+1}</div>
            <h3 style={{margin:0,fontSize:18,fontWeight:700,color:"#fff"}}>{e.titulo}</h3>
          </div>
        </div>
        <p style={{margin:"0 0 16px",...S.prose,color:"#fde8e8"}}>{e.meditacion}</p>
        <div style={{background:"#1a0000",borderRadius:10,padding:"14px 16px",borderLeft:"3px solid #ef4444"}}>
          <div style={{...S.label,color:"#fca5a5",marginBottom:6}}>Oración</div>
          <p style={{margin:0,...S.prose,fontStyle:"italic",color:"#fde8e8",fontSize:14}}>«{e.oracion}»</p>
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:12,color:"#7f1d1d",fontStyle:"italic"}}>Te adoramos, Cristo, y te bendecimos, porque por tu Santa Cruz redimiste al mundo.</div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={()=>setEst(Math.max(0,est-1))} disabled={est===0} style={{flex:1,padding:"11px",background:est===0?"#0d0620":"#2d0000",border:"none",borderRadius:10,color:est===0?"#4b5563":"#fca5a5",cursor:est===0?"default":"pointer",fontFamily:"'Lora',serif",fontSize:13}}>← Anterior</button>
        <button onClick={()=>{setDone(p=>({...p,[est]:true}));if(est<13)setEst(est+1);}} style={{flex:1,padding:"11px",background:"#7f1d1d",border:"none",borderRadius:10,color:"#fff",cursor:"pointer",fontFamily:"'Lora',serif",fontSize:13}}>{est<13?"Siguiente →":"✓ Completar"}</button>
      </div>
    </div>
  );
}

function TabHomilias() {
  const [filtro, setFiltro] = useState("Todos");
  const [abierta, setAbierta] = useState(null);
  const filtradas = filtro==="Todos"?HOMILIAS_ECP:HOMILIAS_ECP.filter(h=>h.tema===filtro);
  return (
    <div>
      <div style={{...S.card,marginBottom:16,background:"linear-gradient(135deg,#1e0a38,#120820)"}}>
        <div style={S.label}>📚 Homilías de «Es Cristo que Pasa»</div>
        <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:700}}>San Josemaría para este tiempo</h2>
        <p style={{margin:0,...S.prose,fontSize:13,color:"#a78bca",fontStyle:"italic"}}>"Es Cristo que pasa" recoge las homilías de san Josemaría. Estas selecciones son especialmente relevantes para Cuaresma y Semana Santa.</p>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16}}>
        {["Todos","Cuaresma","Semana Santa"].map(f=>(
          <button key={f} onClick={()=>setFiltro(f)} style={S.btn(filtro===f)}>{f}</button>
        ))}
      </div>
      {filtradas.map((h,i)=>(
        <div key={i} style={{...S.card,marginBottom:12,border:`1px solid ${h.color}44`,cursor:"pointer"}} onClick={()=>setAbierta(abierta===i?null:i)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{flex:1}}>
              <div style={{...S.label,color:h.color,marginBottom:4}}>{h.numero} · {h.tema}</div>
              <h3 style={{margin:"0 0 6px",fontSize:17,fontWeight:700}}>{h.titulo}</h3>
            </div>
            <span style={{color:"#6d5090",fontSize:18,marginLeft:12}}>{abierta===i?"▲":"▼"}</span>
          </div>
          {abierta===i && (
            <div style={{marginTop:14}}>
              <p style={{margin:"0 0 14px",...S.prose}}>{h.resumen}</p>
              <div style={{background:"#0d0620",borderRadius:10,padding:"14px 16px",marginBottom:12}}>
                <div style={{...S.label,marginBottom:8}}>Citas destacadas</div>
                {h.citas.map((c,ci)=>(
                  <p key={ci} style={{margin:"0 0 8px",...S.prose,fontStyle:"italic",color:"#c084fc",fontSize:14}}>{c}</p>
                ))}
              </div>
              <a href={h.url} target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:8,padding:"9px 16px",background:h.color,borderRadius:10,textDecoration:"none",color:"#fff",fontSize:13,fontFamily:"'Lora',serif"}}>
                Leer homilía completa →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TabMisas() {
  const [busqueda, setBusqueda] = useState("");
  const [ciudadSel, setCiudadSel] = useState(null);
  const ciudadesFilt = MISAS_CIUDADES.filter(c=>c.ciudad.toLowerCase().includes(busqueda.toLowerCase()));
  return (
    <div>
      <div style={{...S.card,marginBottom:16,background:"linear-gradient(135deg,#0d1a0d,#120820)"}}>
        <div style={{...S.label,color:"#86efac"}}>⛪ Horarios de Misa en España</div>
        <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:700}}>Busca tu iglesia</h2>
        <p style={{margin:0,...S.prose,fontSize:13,color:"#4a6a4a",fontStyle:"italic"}}>Horarios orientativos. Verifica siempre en la web de cada parroquia, especialmente en Semana Santa.</p>
      </div>
      <div style={{position:"relative",marginBottom:16}}>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Buscar ciudad (Madrid, Barcelona, Sevilla...)" style={{width:"100%",padding:"12px 16px 12px 40px",background:"#0d0620",border:"1px solid #3d1a6e",borderRadius:12,color:"#e2d0ff",fontSize:14,fontFamily:"'Lora',serif",outline:"none",boxSizing:"border-box"}} />
        <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#6d5090",fontSize:18}}>🔍</span>
      </div>
      {ciudadesFilt.map((c,ci)=>(
        <div key={ci} style={{marginBottom:10}}>
          <button onClick={()=>setCiudadSel(ciudadSel===ci?null:ci)} style={{width:"100%",background:ciudadSel===ci?"#1e3a1e":"#120820",border:`1px solid ${ciudadSel===ci?"#2d6a2d":"#2d0b5c"}`,borderRadius:12,padding:"14px 18px",color:"#f0e6ff",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"'Lora',serif",fontSize:16,fontWeight:700}}>
            <span>📍 {c.ciudad}</span>
            <span style={{color:"#6d5090"}}>{ciudadSel===ci?"▲":"▼"}</span>
          </button>
          {ciudadSel===ci && (
            <div style={{background:"#0d1a0d",border:"1px solid #2d6a2d",borderRadius:"0 0 12px 12px",borderTop:"none"}}>
              {c.iglesias.map((ig,ii)=>(
                <div key={ii} style={{padding:"16px 18px",borderBottom:ii<c.iglesias.length-1?"1px solid #1a2e1a":"none"}}>
                  <div style={{fontSize:15,fontWeight:700,color:"#86efac",marginBottom:6}}>{ig.nombre}</div>
                  <div style={{fontSize:13,color:"#d1fae5",fontFamily:"'Crimson Pro',serif",lineHeight:1.8}}>{ig.horarios}</div>
                  <a href={`https://${ig.dominio}`} target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:8,fontSize:12,color:"#4a6a4a",fontFamily:"'Lora',serif"}}>🌐 {ig.dominio} →</a>
                </div>
              ))}
              <div style={{padding:"12px 18px",background:"#0a1a0a",borderRadius:"0 0 12px 12px"}}>
                <a href={`https://www.geolocaliza.com/iglesias/${c.ciudad.toLowerCase()}`} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:"#2d6a2d",fontFamily:"'Lora',serif",textDecoration:"none"}}>🗺️ Ver todas las iglesias en {c.ciudad} →</a>
              </div>
            </div>
          )}
        </div>
      ))}
      {ciudadesFilt.length===0 && (
        <div style={{...S.card,textAlign:"center",padding:"32px"}}>
          <div style={{fontSize:24,marginBottom:8}}>⛪</div>
          <div style={{fontSize:14,color:"#4a3560",fontStyle:"italic"}}>No encontramos "{busqueda}". Prueba con otra ciudad.</div>
          <a href="https://parroquias.org" target="_blank" rel="noopener noreferrer" style={{display:"inline-block",marginTop:12,fontSize:13,color:"#c084fc"}}>Buscar en parroquias.org →</a>
        </div>
      )}
      <div style={{...S.card,marginTop:16,background:"#0a1a0a",border:"1px solid #2d6a2d"}}>
        <div style={{...S.label,color:"#86efac"}}>Recursos externos</div>
        {[["🗺️ Mapa de iglesias – parroquias.org","https://parroquias.org"],["⛪ Centros del Opus Dei en España","https://opusdei.org/es-es/region/spain/"],["📅 Horarios Semana Santa 2025","https://semanasanta.es"]].map(([t,u],i)=>(
          <a key={i} href={u} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",padding:"11px 0",borderBottom:i<2?"1px solid #1a2e1a":"none",textDecoration:"none",color:"#d1fae5",fontSize:14,fontFamily:"'Crimson Pro',serif"}}>
            <span style={{flex:1}}>{t}</span><span style={{color:"#2d6a2d"}}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}

function TabNotas({ dayData }) {
  const [notas, setNotas] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cuaresma_notas")||"{}"); } catch { return {}; }
  });
  const [texto, setTexto] = useState(notas[dayData.day]||"");
  const [guardado, setGuardado] = useState(false);
  useEffect(()=>{ setTexto(notas[dayData.day]||""); },[dayData.day]);
  function guardar() {
    const nuevas = {...notas,[dayData.day]:texto};
    setNotas(nuevas);
    try { localStorage.setItem("cuaresma_notas",JSON.stringify(nuevas)); } catch {}
    setGuardado(true); setTimeout(()=>setGuardado(false),2000);
  }
  const diasConNotas = Object.keys(notas).filter(k=>notas[k]?.trim());
  return (
    <div>
      <div style={{...S.card,marginBottom:16}}>
        <div style={S.label}>📝 Notas espirituales · Día {dayData.day}</div>
        <div style={{fontSize:13,color:"#6d5090",marginBottom:12,fontStyle:"italic",fontFamily:"'Crimson Pro',serif"}}>{dayData.titulo} — {dayData.fecha}</div>
        <textarea value={texto} onChange={e=>setTexto(e.target.value)} placeholder="Escribe aquí tu moción de hoy, lo que el Señor te ha dicho en la oración, una resolución, un propósito..." style={{width:"100%",minHeight:180,background:"#0d0620",border:"1px solid #3d1a6e",borderRadius:10,color:"#e2d0ff",fontSize:15,fontFamily:"'Crimson Pro',serif",padding:"14px",boxSizing:"border-box",outline:"none",lineHeight:1.8,resize:"vertical"}} />
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
          <div style={{fontSize:12,color:guardado?"#34d399":"#4a3560"}}>{guardado?"✓ Guardado":"Las notas se guardan en este dispositivo"}</div>
          <button onClick={guardar} style={{...S.aiBtn}}>Guardar</button>
        </div>
      </div>
      {diasConNotas.length>0 && (
        <div style={S.card}>
          <div style={S.label}>Días con reflexiones guardadas</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {diasConNotas.map(d=>(
              <div key={d} style={{background:"#1e0d38",border:"1px solid #3d1a6e",borderRadius:8,padding:"6px 12px",fontSize:12,color:"#c084fc"}}>
                Día {d} · {LENT_DAYS[parseInt(d)-1]?.fecha||""}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TabSemanaSanta() {
  const [diaActivo, setDiaActivo] = useState(0);
  const d = SEMANA_SANTA[diaActivo];
  return (
    <div>
      <div style={{...S.card,marginBottom:16,background:`linear-gradient(135deg,${d.color}22,#120820)`,border:`1px solid ${d.color}55`}}>
        <div style={S.label}>Semana Santa 2025</div>
        <h2 style={{margin:"0 0 4px",fontSize:20,fontWeight:700}}>Del Ramos a la Resurrección</h2>
        <p style={{margin:0,fontStyle:"italic",color:"#a78bca",fontFamily:"'Crimson Pro',serif",fontSize:13}}>"La Semana Santa es la semana del amor de Dios." — San Josemaría</p>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {SEMANA_SANTA.map((ss,i)=>(
          <button key={i} onClick={()=>setDiaActivo(i)} style={{padding:"8px 10px",borderRadius:10,border:`1px solid ${i===diaActivo?ss.color:"#2d0b5c"}`,background:i===diaActivo?ss.color+"33":"transparent",color:i===diaActivo?"#fff":"#6d5090",cursor:"pointer",fontSize:11,textAlign:"center",fontFamily:"'Lora',serif"}}>
            <div style={{fontSize:15}}>{ss.icono}</div>
            <div style={{fontSize:10,marginTop:2}}>{ss.fecha}</div>
          </button>
        ))}
      </div>
      <div style={{...S.card,border:`1px solid ${d.color}55`,marginBottom:12}}>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:32}}>{d.icono}</div>
          <div>
            <div style={{fontSize:11,color:"#7c6aa0",letterSpacing:1,textTransform:"uppercase"}}>{d.fecha}</div>
            <h3 style={{margin:0,fontSize:20,fontWeight:700}}>{d.dia}</h3>
          </div>
        </div>
        <p style={{margin:"0 0 14px",...S.prose}}>{d.espiritu}</p>
        {[["Liturgia",d.liturgia,"#1e293b","#94a3b8"],["Propuesta práctica",d.propuesta,"#0a1a0a","#86efac"],["Mortificación",d.mortificacion,"#1a0000","#fca5a5"],["Oración del día",`«${d.oracion}»`,"#1e0d38","#c084fc"]].map(([t,c,bg,col])=>(
          <div key={t} style={{background:bg,borderRadius:10,padding:"12px 14px",marginBottom:10}}>
            <div style={{fontSize:11,color:col,letterSpacing:1,textTransform:"uppercase",marginBottom:5}}>{t}</div>
            <p style={{margin:0,fontSize:14,color:"#e2d0ff",fontFamily:"'Crimson Pro',serif",lineHeight:1.6,fontStyle:t==="Oración del día"?"italic":"normal"}}>{c}</p>
          </div>
        ))}
      </div>
      {d.dia==="Domingo de Resurrección"&&<div style={{...S.card,background:"linear-gradient(135deg,#1a1000,#120820)",border:"1px solid #d97706",textAlign:"center",padding:"28px"}}>
        <div style={{fontSize:36,marginBottom:8}}>☀️</div>
        <div style={{fontSize:20,fontWeight:700,color:"#fcd34d",marginBottom:6}}>¡Alleluia! ¡Cristo ha resucitado!</div>
        <p style={{margin:0,fontStyle:"italic",color:"#fde68a",fontFamily:"'Crimson Pro',serif"}}>La Cuaresma ha terminado. Vive la Pascua cada día.</p>
      </div>}
    </div>
  );
}

function TabExamen({ dayData }) {
  const [ans, setAns] = useState({});
  return (
    <div>
      <div style={{...S.card,marginBottom:16}}>
        <h2 style={{margin:"0 0 6px",fontSize:21,fontWeight:700}}>Examen de Conciencia</h2>
        <p style={{margin:"0 0 20px",...S.prose,fontStyle:"italic",color:"#a78bca",fontSize:14}}>"Examínate al final de la jornada." — San Josemaría</p>
        {EXAMENES.map((p,i)=>(
          <div key={i} style={{marginBottom:12,padding:"14px",background:"#0d0620",borderRadius:12,borderLeft:`3px solid ${ans[i]==="sí"?"#34d399":ans[i]==="no"?"#f87171":"#4c1d95"}`}}>
            <div style={{...S.prose,fontSize:14,marginBottom:10}}>{i+1}. {p}</div>
            <div style={{display:"flex",gap:6}}>
              {["sí","no","a medias"].map(o=>(
                <button key={o} onClick={()=>setAns(a=>({...a,[i]:o}))} style={{...S.btn(ans[i]===o,"#5b21b6"),fontSize:11,padding:"5px 10px"}}>{o}</button>
              ))}
            </div>
          </div>
        ))}
        <div style={{marginTop:16,background:"#0d0620",borderRadius:12,padding:"16px",textAlign:"center"}}>
          <div style={{...S.label,marginBottom:8}}>Acto de contrición</div>
          <p style={{margin:0,...S.prose,fontStyle:"italic",fontSize:14}}>Señor mío Jesucristo, Dios y Hombre verdadero, me pesa de todo corazón haberte ofendido... Dame tu gracia para no volver a pecar.</p>
        </div>
      </div>
    </div>
  );
}

function TabCalendario({ selectedDay, setSelectedDay, setTab, todayIdx }) {
  return (
    <div>
      <div style={{...S.label,marginBottom:12}}>Los 40 días de Cuaresma</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(130px,1fr))",gap:8}}>
        {LENT_DAYS.map((d,i)=>(
          <button key={i} onClick={()=>{setSelectedDay(i);setTab("hoy");}} style={{background:i===selectedDay?"#5b21b6":i===todayIdx?"#2d0b5c":"#120820",border:`1px solid ${i===selectedDay?"#c084fc":i===todayIdx?"#6d28d9":"#2d0b5c"}`,borderRadius:12,padding:"12px 10px",cursor:"pointer",textAlign:"left",transition:"all 0.15s"}}>
            <div style={{fontSize:10,color:"#6d5090",marginBottom:2}}>{d.fecha}</div>
            <div style={{fontSize:11,color:i===selectedDay?"#fff":"#c084fc",fontWeight:600}}>Día {d.day}</div>
            <div style={{fontSize:11,color:i===selectedDay?"#e2d0ff":"#5a4070",lineHeight:1.3,marginTop:2}}>{d.titulo}</div>
            {i===todayIdx&&<div style={{fontSize:9,color:"#34d399",marginTop:4,letterSpacing:1}}>● HOY</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

function TabCamino() {
  return (
    <div>
      <div style={{...S.card,marginBottom:16}}>
        <div style={S.label}>📖 Puntos de «Camino»</div>
        {CAMINO_QUOTES.map((q,i)=>(
          <div key={i} style={{padding:"18px 0",borderBottom:i<CAMINO_QUOTES.length-1?"1px solid #1e0d38":"none",borderLeft:"3px solid #7c3aed",paddingLeft:16,marginLeft:-16,paddingLeft:20,marginBottom:0}}>
            <div style={{fontSize:11,color:"#6d28d9",letterSpacing:2,marginBottom:8}}>N.º {q.num}</div>
            <p style={{margin:0,...S.prose,fontStyle:"italic",fontSize:16}}>«{q.texto}»</p>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <div style={S.label}>Recursos Opus Dei</div>
        {[["opusdei.org – Espiritualidad","https://opusdei.org/es-es/"],["San Josemaría – Textos y homilías","https://opusdei.org/es-es/section/san-josemaria/"],["Preparación para la confesión","https://opusdei.org/es-es/article/confesion/"]].map(([t,u],i)=>(
          <a key={i} href={u} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",padding:"11px 0",borderBottom:i<2?"1px solid #1e0d38":"none",textDecoration:"none",color:"#d8c4f0",fontSize:14,fontFamily:"'Crimson Pro',serif"}}>
            <span style={{flex:1}}>{t}</span><span style={{color:"#6d28d9"}}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── APP PRINCIPAL ──────────────────────────────────────────────────────────

export default function CuaresmaApp() {
  const todayIdx = getLentDay();
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [tab, setTab] = useState("hoy");
  const dayData = LENT_DAYS[selectedDay];

  const TABS = [
    ["hoy","🕯️","Hoy"],
    ["rosario","📿","Rosario"],
    ["viacrucis","✝️","Vía Crucis"],
    ["semanasanta","🌿","Semana Santa"],
    ["homilias","📚","Homilías"],
    ["misas","⛪","Misas"],
    ["examen","🔍","Examen"],
    ["notas","📝","Notas"],
    ["calendario","📅","Calendario"],
    ["camino","📖","Camino"],
  ];

  return (
    <div style={S.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,400;1,600&display=swap" rel="stylesheet"/>
      <div style={{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:400,height:400,opacity:0.025,pointerEvents:"none",zIndex:0}}>
        <svg viewBox="0 0 100 100"><rect x="45" y="5" width="10" height="90" fill="white"/><rect x="15" y="30" width="70" height="10" fill="white"/></svg>
      </div>

      {/* Header */}
      <div style={{background:"linear-gradient(180deg,#2d0b5c 0%,#0f0520 100%)",borderBottom:"1px solid #2d0b5c",padding:"22px 20px 0",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:680,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div>
              <h1 style={{margin:"2px 0 0",fontSize:22,fontWeight:700,letterSpacing:-0.5}}>Cuaresma 2026</h1>
            </div>
            <div style={{background:"#2d0b5c",border:"1px solid #6d28d9",borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
              <div style={{fontSize:20,fontWeight:700,color:"#c084fc",fontFamily:"'Crimson Pro',serif"}}>Día {dayData.day}</div>
              <div style={{fontSize:10,color:"#7c3aed",letterSpacing:1}}>{dayData.fecha}</div>
            </div>
          </div>
          {/* Tab nav — scrollable */}
          <div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:12,scrollbarWidth:"none"}}>
            {TABS.map(([id,ic,label])=>(
              <button key={id} onClick={()=>setTab(id)} style={{...S.btn(tab===id),display:"flex",alignItems:"center",gap:4,whiteSpace:"nowrap",padding:"7px 12px"}}>
                <span>{ic}</span><span style={{fontSize:11}}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 40px"}}>
        {tab==="hoy" && <TabHoy dayData={dayData} todayIdx={todayIdx} selectedDay={selectedDay}/>}
        {tab==="rosario" && <TabRosario/>}
        {tab==="viacrucis" && <TabViacrucis/>}
        {tab==="semanasanta" && <TabSemanaSanta/>}
        {tab==="homilias" && <TabHomilias/>}
        {tab==="misas" && <TabMisas/>}
        {tab==="examen" && <TabExamen dayData={dayData}/>}
        {tab==="notas" && <TabNotas dayData={dayData}/>}
        {tab==="calendario" && <TabCalendario selectedDay={selectedDay} setSelectedDay={setSelectedDay} setTab={setTab} todayIdx={todayIdx}/>}
        {tab==="camino" && <TabCamino/>}

        <div style={{textAlign:"center",marginTop:32,paddingTop:20,borderTop:"1px solid #1e0d38"}}>
          <div style={{fontSize:12,color:"#3d1a6e",fontStyle:"italic",fontFamily:"'Crimson Pro',serif"}}>
            «Dios te espera cada día. ¡No le faltes!»<br/>
            <span style={{fontSize:11,color:"#2d0b5c"}}>— San Josemaría Escrivá</span>
          </div>
        </div>
      </div>
    </div>
  );
}
