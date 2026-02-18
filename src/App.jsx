import { useState, useEffect } from "react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────

const C = {
  bg:        "#0c0a07",
  bgCard:    "#13100d",
  bgDeep:    "#090806",
  gold:      "#c9a84c",
  goldMid:   "#a8843a",
  goldDim:   "#6b5425",
  burgundy:  "#7c1d2e",
  burLight:  "#c0334d",
  cream:     "#f0e8d8",
  creamDim:  "#b8a888",
  creamFade: "#6b5f48",
  border:    "#2a2218",
  borderGold:"#4a3818",
  green:     "#1a4a2e",
  greenLight:"#2a5a2a",
};

const S = {
  wrap: { minHeight:"100vh", background:C.bg, color:C.cream, fontFamily:"'EB Garamond',Georgia,serif", position:"relative" },
  card: { background:`linear-gradient(145deg,${C.bgCard},${C.bgDeep})`, border:`1px solid ${C.border}`, borderRadius:14, padding:"20px", boxShadow:"0 2px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(201,168,76,0.05)" },
  cardGold: { background:`linear-gradient(145deg,#1a1408,#0e0c07)`, border:`1px solid ${C.borderGold}`, borderRadius:14, padding:"20px", boxShadow:"0 2px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(201,168,76,0.1)" },
  label: { fontSize:10, letterSpacing:3, textTransform:"uppercase", color:C.goldMid, marginBottom:10, fontFamily:"'Cinzel',serif", fontWeight:600, display:"block" },
  prose: { fontFamily:"'EB Garamond',serif", fontSize:17, lineHeight:1.9, color:C.creamDim },
  title: { fontFamily:"'Cinzel',serif", fontWeight:700, letterSpacing:0.5 },
  btn: (active, col) => {
    const bg = col || C.burgundy;
    return { padding:"7px 14px", borderRadius:6, border:"none", cursor:"pointer", fontSize:10, fontFamily:"'Cinzel',serif", fontWeight:600, letterSpacing:1, background:active?bg:"transparent", color:active?"#fff":C.creamFade, border:`1px solid ${active?bg:C.border}`, transition:"all 0.2s", textTransform:"uppercase" };
  },
  chip: { display:"inline-block", padding:"4px 10px", borderRadius:4, fontSize:11, fontFamily:"'Cinzel',serif", letterSpacing:1, textTransform:"uppercase" },
  divider: { borderTop:`1px solid ${C.border}`, margin:"16px 0" },
  link: { display:"flex", alignItems:"center", padding:"11px 0", textDecoration:"none", color:C.creamDim, fontSize:15, fontFamily:"'EB Garamond',serif" },
};

// ─── DATOS ──────────────────────────────────────────────────────────────────

const LENT_START = new Date("2026-02-18");

const LENT_DAYS = [
  { day:1,  fecha:"18 Feb", titulo:"Miércoles de Ceniza",      evangelio:"Mt 6, 1-6.16-18",    santo:"San Simeón",                  mortificacion:"Ayuno y abstinencia. Ofrece el hambre unida a la Cruz.",      reflexion:"Jesús advierte contra la hipocresía religiosa: no hagas obras piadosas para que te vean. La oración, el ayuno y la limosna han de brotar del amor interior. La Cuaresma comienza con esta llamada a la autenticidad: ¿hago las cosas para Dios o para los demás?", color:C.burgundy },
  { day:2,  fecha:"19 Feb", titulo:"Jueves tras Ceniza",        evangelio:"Lc 9, 22-25",         santo:"Santa Álvara",                 mortificacion:"Silencio en redes sociales. Hoy: silencio interior.",          reflexion:"«El que quiera salvar su vida, la perderá.» Jesús propone una paradoja que es toda una pedagogía de vida. La lógica del mundo dice: cuídate. La lógica del Evangelio dice: date. La Cuaresma es tiempo de practicar esa entrega en lo pequeño.", color:C.burgundy },
  { day:3,  fecha:"20 Feb", titulo:"Viernes 1ª semana",         evangelio:"Mt 9, 14-15",          santo:"San Eucario",                  mortificacion:"Abstinencia. Ofrece la sobriedad en la mesa.",                 reflexion:"Los discípulos de Juan ayunan; los de Jesús no. ¿Por qué? Porque el Novio está con ellos. Toda penitencia cuaresmal tiene sentido solo si brota del amor: no es tristeza, es preparación gozosa para la Pascua.", color:C.burgundy },
  { day:4,  fecha:"21 Feb", titulo:"Sábado 1ª semana",          evangelio:"Lc 5, 27-32",          santo:"San Pedro Damián",             mortificacion:"Un momento de servicio concreto a tu familia hoy.",            reflexion:"Jesús llama a Leví, un publicano despreciado, y come con pecadores. El escándalo de la misericordia: Dios busca a los que están lejos. ¿A quién excluyes tú de tu mirada?", color:C.burgundy },
  { day:5,  fecha:"22 Feb", titulo:"1er Domingo de Cuaresma",   evangelio:"Lc 4, 1-13",           santo:"Cátedra de San Pedro",         mortificacion:"Contempla las tentaciones de Jesús en el desierto.",          reflexion:"Jesús es tentado en el desierto durante cuarenta días. Las tentaciones del poder, el placer y el prestigio. Responde con la Palabra de Dios. Tu Cuaresma es también un desierto donde afinar tu respuesta a esas mismas tentaciones.", color:C.burgundy },
  { day:6,  fecha:"23 Feb", titulo:"Lunes 1ª semana",           evangelio:"Mt 25, 31-46",         santo:"San Policarpo",                mortificacion:"Haz una obra de misericordia corporal hoy.",                  reflexion:"«Lo que hicisteis al más pequeño de mis hermanos, a mí me lo hicisteis.» El juicio final no pregunta por ideas sino por obras de misericordia. En las personas que sufren a tu lado, está Cristo esperando tu mirada.", color:C.burgundy },
  { day:7,  fecha:"24 Feb", titulo:"Martes 1ª semana",          evangelio:"Mt 6, 7-15",           santo:"San Matías",                  mortificacion:"Reza el Padre Nuestro muy despacio, palabra a palabra.",       reflexion:"Jesús nos enseña el Padre Nuestro: oración filial, confiada, comunitaria. No oraciones largas y vacías, sino el corazón que habla a su Padre. Hoy, reza despacio cada palabra como si fuera la primera vez.", color:C.burgundy },
  { day:8,  fecha:"25 Feb", titulo:"Miércoles 1ª semana",       evangelio:"Lc 11, 29-32",         santo:"San Cesáreo",                 mortificacion:"Apaga la pantalla 1 hora antes de dormir.",                   reflexion:"La generación pide señales, pero la única señal es Jonás. ¿Exiges señales de Dios, o confías en la señal definitiva que ya nos dio con la Resurrección?", color:C.burgundy },
  { day:9,  fecha:"26 Feb", titulo:"Jueves 1ª semana",          evangelio:"Mt 7, 7-12",           santo:"San Porfirio",                mortificacion:"Extiende tu oración 5 minutos hoy.",                          reflexion:"«Pedid y se os dará.» La oración de petición no es imponer nuestra voluntad a Dios: es expresarle nuestra necesidad con confianza de hijos. Dios sabe lo que necesitas, pero quiere que se lo pidas.", color:C.burgundy },
  { day:10, fecha:"27 Feb", titulo:"Viernes 1ª semana",         evangelio:"Mt 5, 20-26",          santo:"San Gabriel de la Dolorosa",  mortificacion:"Abstinencia. Reconcíliate con alguien si hay distancia.",     reflexion:"«Si no perdonáis a los hombres, tampoco vuestro Padre perdonará vuestras ofensas.» La reconciliación no es opcional en la vida cristiana. ¿Hay alguien a quien necesitas perdonar hoy?", color:C.burgundy },
  { day:11, fecha:"28 Feb", titulo:"Sábado 1ª semana",          evangelio:"Mt 5, 43-48",          santo:"San Osvaldo",                 mortificacion:"Reza por un enemigo o por quien te haya herido.",             reflexion:"«Amad a vuestros enemigos.» El mandamiento más difícil y el más revelador. Solo quien ha experimentado el amor gratuito de Dios puede amar así. Pide hoy esa gracia que tú solo no puedes alcanzar.", color:C.burgundy },
  { day:12, fecha:"1 Mar",  titulo:"2º Domingo de Cuaresma",    evangelio:"Lc 9, 28-36",          santo:"San Albino",                  mortificacion:"Contempla la Transfiguración. ¿Qué quiere mostrarte el Señor?", reflexion:"La Transfiguración: Pedro, Santiago y Juan ven la gloria de Cristo. Ese mismo Cristo glorioso es el que camina contigo cada día. La fe es ver —aunque sea con los ojos del alma— esa misma luz en lo ordinario.", color:C.burgundy },
  { day:13, fecha:"2 Mar",  titulo:"Lunes 2ª semana",           evangelio:"Lc 6, 36-38",          santo:"San Simplicio",               mortificacion:"Misericordia en el trato. No juzgues hoy a nadie.",           reflexion:"«Sed misericordiosos como vuestro Padre es misericordioso.» La misericordia no es debilidad: es la fuerza de quien ha sido perdonado. ¿Cómo está tu corazón con aquellos que te han fallado?", color:C.burgundy },
  { day:14, fecha:"3 Mar",  titulo:"Martes 2ª semana",          evangelio:"Mt 23, 1-12",           santo:"San Casimiro",                mortificacion:"Humildad concreta: deja que otro tenga razón hoy.",            reflexion:"Jesús denuncia la hipocresía de quienes predican y no practican. El mayor de todos ha de ser el servidor de todos. La Cuaresma es tiempo de revisar si lo que dices y lo que vives coinciden.", color:C.burgundy },
  { day:15, fecha:"4 Mar",  titulo:"Miércoles 2ª semana",       evangelio:"Mt 20, 17-28",         santo:"San Casimiro",                mortificacion:"¿Buscas ser servido o servir? Una obra concreta hoy.",        reflexion:"Los hijos de Zebedeo piden los primeros puestos. Jesús responde: el que quiera ser grande, que sea servidor. ¿Buscas en tu trabajo reconocimiento o servicio?", color:C.burgundy },
  { day:16, fecha:"5 Mar",  titulo:"Jueves 2ª semana",          evangelio:"Lc 16, 19-31",         santo:"San Juan José de la Cruz",    mortificacion:"¿Cómo usas los bienes materiales? Una limosna hoy.",         reflexion:"El rico Epulón y el pobre Lázaro. La distancia entre ellos en vida se convierte en abismo eterno. ¿Hay algún 'Lázaro' a tu puerta al que no estás viendo?", color:C.burgundy },
  { day:17, fecha:"6 Mar",  titulo:"Viernes 2ª semana",         evangelio:"Mt 21, 33-46",         santo:"San Coleta",                  mortificacion:"Abstinencia. Medita un momento de la Pasión.",               reflexion:"Los labradores de la viña rechazan al hijo del dueño. La historia de la salvación es la historia de ese rechazo. Y sin embargo Dios sigue llamando. ¿Cómo recibes tú su llamada hoy?", color:C.burgundy },
  { day:18, fecha:"7 Mar",  titulo:"Sábado 2ª semana",          evangelio:"Lc 15, 1-3.11-32",    santo:"Santas Perpetua y Felicidad", mortificacion:"El Hijo Pródigo: prepara tu confesión.",                      reflexion:"El padre ve llegar al hijo de lejos y corre a su encuentro. No espera a que llegue: corre. Así es Dios con nosotros. La confesión es ese abrazo del Padre que corre a tu encuentro.", color:C.burgundy },
  { day:19, fecha:"8 Mar",  titulo:"3er Domingo de Cuaresma",   evangelio:"Lc 13, 1-9",           santo:"San Juan de Dios",            mortificacion:"¿Qué frutos da tu vida? Tiempo de conversión.",              reflexion:"La higuera sin frutos recibe una prórroga: un año más. Dios es paciente, pero la vida pasa. ¿Qué frutos concretos espera Dios de ti en esta Cuaresma?", color:C.burgundy },
  { day:20, fecha:"9 Mar",  titulo:"Lunes 3ª semana",           evangelio:"Lc 4, 24-30",          santo:"Santa Francisca Romana",      mortificacion:"¿Te avergüenzas de tu fe en el trabajo?",                    reflexion:"Ningún profeta es bien recibido en su tierra. Jesús lo sabe y lo asume. La fe auténtica siempre incomoda. ¿Hay algo de tu fe que has suavizado para no incomodar a quienes te rodean?", color:C.burgundy },
  { day:21, fecha:"10 Mar", titulo:"Martes 3ª semana",          evangelio:"Mt 18, 21-35",         santo:"San Macario de Jerusalén",    mortificacion:"Perdona de verdad a alguien hoy.",                           reflexion:"Pedro pregunta si basta perdonar siete veces. Jesús dice: setenta veces siete. Es decir: siempre. El perdón no es una emoción que sientes: es una decisión que tomas.", color:C.burgundy },
  { day:22, fecha:"11 Mar", titulo:"Miércoles 3ª semana",       evangelio:"Mt 5, 17-19",          santo:"San Eulogio de Córdoba",      mortificacion:"Cumple un punto del Plan de Vida descuidado.",               reflexion:"Jesús no vino a abolir la ley sino a darle su pleno sentido. La letra sin el espíritu mata; el espíritu sin la letra se pierde. ¿Vives tu fe como regla o como amor?", color:C.burgundy },
  { day:23, fecha:"12 Mar", titulo:"Jueves 3ª semana",          evangelio:"Lc 11, 14-23",         santo:"San Gregorio Magno",          mortificacion:"Identifica tu defecto capital y atácalo hoy.",               reflexion:"«El que no está conmigo, está contra mí.» No hay neutralidad ante Cristo. La vida cristiana exige una opción clara y renovada cada día. ¿Dónde estás tú hoy?", color:C.burgundy },
  { day:24, fecha:"13 Mar", titulo:"Viernes 3ª semana",         evangelio:"Mc 12, 28-34",         santo:"San Rodrigo de Córdoba",      mortificacion:"Abstinencia. ¿A quién debes amar mejor?",                    reflexion:"El mandamiento principal es el amor a Dios y al prójimo. El escriba lo entiende con la cabeza; Jesús lo pide con el corazón. Hoy, ¿a quién necesitas amar mejor?", color:C.burgundy },
  { day:25, fecha:"14 Mar", titulo:"Sábado 3ª semana",          evangelio:"Lc 18, 9-14",          santo:"Santa Matilde",               mortificacion:"Reza sin actitudes de superioridad.",                         reflexion:"El publicano en el fondo del templo se golpea el pecho: '¡Ten compasión de mí, que soy un pecador!' Esta es la única oración que Dios no puede rechazar: la del que sabe que lo necesita.", color:C.burgundy },
  { day:26, fecha:"15 Mar", titulo:"4º Domingo – Laetare",      evangelio:"Lc 15, 1-3.11-32",    santo:"San Longinos",                mortificacion:"Domingo Laetare: ¡alegría! La Cuaresma nos acerca a Pascua.", reflexion:"El padre divide los bienes entre sus hijos. El menor los malgasta; el mayor se queda. Pero el padre ama a los dos. ¿Con cuál de los dos te identificas hoy?", color:C.burgundy },
  { day:27, fecha:"16 Mar", titulo:"Lunes 4ª semana",           evangelio:"Jn 4, 43-54",          santo:"San Heriberto",               mortificacion:"Ofrece tus preocupaciones de hoy con confianza.",            reflexion:"El funcionario real pide a Jesús que cure a su hijo. Jesús lo cura a distancia. La fe que actúa sin ver, que confía antes de comprobar. ¿Así es tu fe, o condicionas la confianza a los resultados?", color:C.burgundy },
  { day:28, fecha:"17 Mar", titulo:"Martes 4ª semana",          evangelio:"Jn 5, 1-16",           santo:"San Patricio de Irlanda",     mortificacion:"«¿Quieres curar?» ¿Quieres de verdad cambiar?",              reflexion:"El paralítico lleva treinta y ocho años junto a la piscina. «¿Quieres curar?» pregunta Jesús. A veces nos acomodamos en nuestra enfermedad espiritual. ¿Quieres de verdad cambiar?", color:C.burgundy },
  { day:29, fecha:"18 Mar", titulo:"Miércoles 4ª semana",       evangelio:"Jn 5, 17-30",          santo:"San Cirilo de Jerusalén",     mortificacion:"¿Buscas la voluntad de Dios o la tuya?",                     reflexion:"«El Hijo no puede hacer nada por su cuenta sino lo que ve hacer al Padre.» Perfecta unión de voluntades. ¿Buscas hacer tu voluntad o la del Padre?", color:C.burgundy },
  { day:30, fecha:"19 Mar", titulo:"San José – Solemnidad",     evangelio:"Mt 1, 16.18-21.24",   santo:"San José, Esposo de la Virgen", mortificacion:"Acude a José como padre. Pídele que cuide tu familia.",    reflexion:"El ángel anuncia a José que María concebirá por obra del Espíritu Santo. José obedece sin entender del todo. Su fe es silenciosa, confiada, operativa. Hoy, confía tú también en lo que Dios hace aunque no lo comprendas.", color:"#8B6914" },
  { day:31, fecha:"20 Mar", titulo:"Viernes 4ª semana",         evangelio:"Jn 7, 1-2.10.25-30",  santo:"San Isidoro de Sevilla",      mortificacion:"Abstinencia. Confía en el tiempo de Dios.",                  reflexion:"Quieren apresarle pero su hora no ha llegado. El tiempo de Dios no siempre coincide con el nuestro. La paciencia espiritual es confiar en que Dios llega a tiempo, aunque tarde.", color:C.burgundy },
  { day:32, fecha:"21 Mar", titulo:"Sábado 4ª semana",          evangelio:"Jn 7, 40-53",          santo:"San Benito de Nursia",        mortificacion:"¿Juzgas a otros en su fe?",                                  reflexion:"Las opiniones se dividen sobre Jesús. Ante Cristo no es posible la indiferencia. ¿Quién es Él para ti?", color:C.burgundy },
  { day:33, fecha:"22 Mar", titulo:"5º Domingo de Cuaresma",    evangelio:"Jn 8, 1-11",           santo:"Santa Catalina de Suecia",    mortificacion:"Recibe el perdón de Dios. ¡Ve a confesarte!",               reflexion:"La mujer adúltera es llevada ante Jesús. Él no la condena sino que la libera: 've y no peques más'. El perdón de Dios no minimiza el pecado: lo destruye y devuelve la libertad.", color:C.burgundy },
  { day:34, fecha:"23 Mar", titulo:"Lunes 5ª semana",           evangelio:"Jn 8, 12-20",          santo:"San Toribio de Mogrovejo",    mortificacion:"¿Tu trabajo refleja la luz de Cristo?",                      reflexion:"«Yo soy la luz del mundo.» Quien sigue a Jesús no camina en tinieblas. ¿Tu vida —tu trabajo, tus relaciones— está iluminada por esa luz o sigues áreas de oscuridad que no quieres mostrarle?", color:C.burgundy },
  { day:35, fecha:"24 Mar", titulo:"Martes 5ª semana",          evangelio:"Jn 8, 21-30",          santo:"San Óscar de Bremen",         mortificacion:"Adoración silenciosa ante el Santísimo.",                    reflexion:"«¿A dónde vas?» preguntan a Jesús. Él va donde el Padre. Toda la vida de Cristo es un movimiento hacia el Padre. ¿Hacia dónde se mueve tu vida?", color:C.burgundy },
  { day:36, fecha:"25 Mar", titulo:"Anunciación del Señor",     evangelio:"Lc 1, 26-38",          santo:"La Virgen en la Anunciación", mortificacion:"El Fiat de María. Di también tu sí a Dios.",                 reflexion:"El Fiat de María: 'Hágase en mí según tu palabra.' La mayor oración de la historia humana. Tres palabras que cambiaron todo. ¿Cuál es tu fiat hoy?", color:"#8B6914" },
  { day:37, fecha:"26 Mar", titulo:"Jueves 5ª semana",          evangelio:"Jn 8, 51-59",          santo:"San Braulio de Zaragoza",     mortificacion:"Humíllate ante la eternidad de Dios.",                       reflexion:"«Antes que Abraham fuera, Yo soy.» La eternidad de Cristo que irrumpe en la historia. Ante esa realidad, toda soberbia humana se desmorona. Humíllate hoy.", color:C.burgundy },
  { day:38, fecha:"27 Mar", titulo:"Viernes 5ª semana",         evangelio:"Jn 10, 31-42",         santo:"San Ruperto de Salzburgo",    mortificacion:"Abstinencia. Vía Crucis completo hoy.",                      reflexion:"Las obras de Cristo dan testimonio de Él aunque no le crean. Tus obras dan testimonio de lo que eres. ¿Qué testimonio están dando hoy tu trabajo y tu trato con los demás?", color:C.burgundy },
  { day:39, fecha:"28 Mar", titulo:"Sábado 5ª semana",          evangelio:"Jn 11, 45-57",         santo:"San Sixto III",               mortificacion:"Prepara tu corazón: silencio y recogimiento.",               reflexion:"Caifás dice sin saberlo una verdad profética: es mejor que muera uno por el pueblo. La Semana Santa está a las puertas. Prepara tu corazón con silencio y recogimiento.", color:C.burgundy },
  { day:40, fecha:"29 Mar", titulo:"Domingo de Ramos",          evangelio:"Lc 19, 28-40",         santo:"San Hermenegildo",            mortificacion:"Entra en Jerusalén con Cristo.",                             reflexion:"La multitud tiende sus mantos y aclama a Jesús como rey. Días después, esas mismas voces gritarán '¡crucifícale!'. La fidelidad a Cristo se prueba en las dificultades, no en los días de triunfo.", color:"#8B6914" },
];

const REFLEXIONES_SJE = [
  { fuente:"Camino, 418", texto:"No te desanimes. No te abandones a la tristeza. Si te dominas, si te niegas en todo lo que puedas, sin exageración, pero con constancia, tendrás paz." },
  { fuente:"Camino, 213", texto:"Lleva la Presencia de Dios. Eso solo hace santos." },
  { fuente:"Forja, 334", texto:"La Cuaresma termina en Pascua. El Viernes Santo no es el final: es el camino hacia el Domingo. Lleva tu cruz con esa certeza." },
  { fuente:"Surco, 455", texto:"No confundas la tristeza espiritual con la contrición. Llorar tus pecados es bueno. Instalarte en la tristeza es malo. Dios perdona y olvida: tú también olvida y camina." },
  { fuente:"Amigos de Dios, 45", texto:"El examen de conciencia diario es una conversación de amor con Dios al final del día. No una comparecencia ante un juez: un encuentro con un Padre que espera tu mirada." },
  { fuente:"Camino, 985", texto:"Persevera en la oración aunque no sientas nada. La oración árida, perseverante, fiel, tiene un valor enorme. Es el amor que ama sin consolaciones." },
  { fuente:"Forja, 16", texto:"Dios te llama a una santidad que está a tu medida: la tuya. No la de otro cristiano que admiras. La tuya, con tus circunstancias, tu trabajo, tu familia." },
  { fuente:"Camino, 902", texto:"Termina bien la Cuaresma. Entra en la Semana Santa con el corazón limpio y disponible. Que la Pascua no te encuentre igual que te encontró la Ceniza." },
];

const VIA_CRUCIS = [
  { num:1,  titulo:"Jesús es condenado a muerte",          meditacion:"Pilato sabe que Jesús es inocente pero cede al miedo. ¿Cuántas veces callas la verdad por miedo al qué dirán? Jesús acepta la injusticia en silencio por amor a ti.", oracion:"Señor, dame valentía para defender la verdad aunque cueste. Perdona mis silencios cobardes." },
  { num:2,  titulo:"Jesús carga con la Cruz",               meditacion:"La Cruz no es castigo sino instrumento de amor. Jesús la abraza. En tu vida ordinaria —trabajo, familia— hay cruces cotidianas. No las rehúyas: ábrazalas con Él.", oracion:"Jesús, enséñame a abrazar mis cruces con alegría, unidas a las tuyas." },
  { num:3,  titulo:"Jesús cae por primera vez",             meditacion:"El Hijo de Dios, exhausto, cae. Y se levanta. Tus caídas y pecados no son el final. Lo que importa es levantarse. San Josemaría: «Tropezaste: ¿y qué? Levántate y sigue.»", oracion:"En mis caídas, dame la gracia de volver a Ti. No me quedo en el suelo." },
  { num:4,  titulo:"Jesús encuentra a su Madre",            meditacion:"María no pudo evitarle el dolor, pero estuvo ahí. Su presencia fue todo. ¿Das tu presencia a los que sufren cerca de ti, o solo consejos? A veces basta con estar.", oracion:"María, enséñame a acompañar a los que sufren como tú acompañaste a tu Hijo." },
  { num:5,  titulo:"El Cireneo ayuda a Jesús",              meditacion:"Simón no quería cargar la Cruz. Le obligaron. Pero al hacerlo, tocó a Cristo. Hay personas que te piden ayuda en momentos incómodos. Ese encuentro forzado es un encuentro con Jesús.", oracion:"Jesús, ayúdame a ver tu rostro en quien necesita mi ayuda hoy." },
  { num:6,  titulo:"La Verónica enjuga el rostro de Jesús", meditacion:"Un gesto pequeño, sin protocolo. Solo amor en acción. Verónica no cambió el curso de la Pasión, pero consoló a Cristo. Tus pequeños gestos de bondad consuelan a Cristo en los demás.", oracion:"Dame ojos para ver dónde puedo consolar a Cristo en mis hermanos." },
  { num:7,  titulo:"Jesús cae por segunda vez",             meditacion:"Segunda caída. ¿Tienes algún pecado al que vuelves una y otra vez? No te desanimes: la misericordia de Dios es más grande que tu miseria.", oracion:"Señor, me pesa haber vuelto a caer. Confío en tu misericordia sin límites." },
  { num:8,  titulo:"Jesús consuela a las mujeres",          meditacion:"Jesús, agotado, se detiene a consolar a otros. Su amor no se agota aunque Él esté al límite. ¿Cómo tratas a tu familia cuando estás cansado?", oracion:"Jesús, cuando esté agotado, que mi amor por los demás no se apague." },
  { num:9,  titulo:"Jesús cae por tercera vez",             meditacion:"Tres veces en el suelo. Y cada vez se levanta. La perseverancia no es no caer: es levantarse siempre. Tu santidad se mide por tu obstinación en levantarte.", oracion:"Dame, Señor, la gracia de la perseverancia. Que nunca me rinda." },
  { num:10, titulo:"Jesús es despojado de sus vestiduras",  meditacion:"Le quitan todo. Queda desnudo, humillado. En algún momento de tu vida también te lo quitaron todo. Jesús estuvo ahí antes que tú.", oracion:"Señor, en mis momentos de humillación, ayúdame a unirlos a los tuyos." },
  { num:11, titulo:"Jesús es clavado en la Cruz",           meditacion:"Los clavos son el sonido del amor de Dios. Cada clavo es un sí definitivo al Padre. ¿Hay algo en tu vida a lo que necesitas decirle un sí definitivo a Dios?", oracion:"Jesús, clavado por amor, ayúdame a dar mi fiat sin condiciones." },
  { num:12, titulo:"Jesús muere en la Cruz",                meditacion:"«Todo está cumplido.» Desde la Cruz nos da a su Madre. Nada queda para Él: todo para nosotros. Contempla en silencio. Solo gratitud.", oracion:"Señor, gracias. Gracias por morir por mí. Que nunca olvide lo que esto costó." },
  { num:13, titulo:"Jesús es bajado de la Cruz",            meditacion:"María sostiene el cuerpo de su Hijo. La Pietà. El momento más silencioso de la historia. Lleva a María tus duelos, lo que has perdido.", oracion:"María, sostén en tus brazos todo lo que yo no puedo sostener." },
  { num:14, titulo:"Jesús es sepultado",                    meditacion:"El silencio del sábado santo. Parece que todo ha terminado. Pero el sepulcro no es el final: es el umbral de la Resurrección. En tus momentos de oscuridad, recuerda: el domingo viene.", oracion:"Señor, en mis noches oscuras, ayúdame a esperar tu Resurrección." },
];

const MISTERIOS_ROSARIO = {
  gozosos:   { nombre:"Misterios Gozosos",   dias:"Lunes y Sábado",    color:"#1e40af", misterios:[
    { num:1, titulo:"La Anunciación",              fruto:"Humildad",               meditacion:"El ángel Gabriel saluda a María. Ella dice su fiat. El Verbo se hace carne. La humildad de Dios que se hace pequeño; la humildad de María que se deja llenar." },
    { num:2, titulo:"La Visitación",               fruto:"Caridad con el prójimo", meditacion:"María va corriendo a servir a Isabel. Lleva a Cristo en su seno y lo lleva a los demás. Cada vez que sirves a otros, llevas a Cristo." },
    { num:3, titulo:"El Nacimiento",               fruto:"Pobreza y desapego",     meditacion:"Dios nace en una cueva. Elige la pobreza, el frío, la marginalidad. ¿Qué apego a lo material te aleja de Él?" },
    { num:4, titulo:"La Presentación en el Templo",fruto:"Obediencia y pureza",    meditacion:"Simeón toma al Niño en brazos: 'Mis ojos han visto tu salvación.' ¿Estás disponible para reconocer a Cristo cuando viene?" },
    { num:5, titulo:"El Niño perdido y hallado",   fruto:"Amor a la vida interior", meditacion:"Tres días buscándole. 'No sabíais que debo estar en las cosas de mi Padre.' ¿Dónde buscas a Jesús cuando le pierdes?" },
  ]},
  dolorosos: { nombre:"Misterios Dolorosos", dias:"Martes y Viernes",  color:"#7c1d2e", misterios:[
    { num:1, titulo:"La Agonía en el Huerto",      fruto:"Contrición",             meditacion:"'Padre, si es posible, que pase este cáliz.' El sudor de sangre. La soledad de Getsemaní. Jesús pasa por el miedo para enseñarte a pasar por el tuyo." },
    { num:2, titulo:"La Flagelación",              fruto:"Mortificación",          meditacion:"Cada latigazo es amor que soporta. Ofrece hoy tus pequeñas mortificaciones unidas a las heridas de Cristo." },
    { num:3, titulo:"La Coronación de Espinas",    fruto:"Humildad",               meditacion:"Le coronan de burla. Pero es el Rey del universo. Las humillaciones que tú sufres, Él las santificó primero." },
    { num:4, titulo:"Jesús carga con la Cruz",     fruto:"Paciencia",              meditacion:"La Cruz sobre los hombros doloridos. Paso a paso hacia el Calvario. Así también tú: un paso detrás de otro, cargando lo tuyo." },
    { num:5, titulo:"La Crucifixión y Muerte",     fruto:"Salvación",              meditacion:"'Todo está cumplido.' Desde la Cruz, te mira. Sabe tu nombre. Murió por ti específicamente. Esto no es poesía: es historia." },
  ]},
  gloriosos: { nombre:"Misterios Gloriosos", dias:"Miércoles y Domingos",color:"#166534", misterios:[
    { num:1, titulo:"La Resurrección",             fruto:"Fe",                     meditacion:"El sepulcro vacío. María Magdalena llora; Jesús la llama por su nombre. Te llama a ti por tu nombre. La muerte no tiene la última palabra." },
    { num:2, titulo:"La Ascensión",                fruto:"Esperanza",              meditacion:"Jesús sube al cielo. 'No os dejaré huérfanos.' Nuestra patria es el cielo; todo lo demás es camino." },
    { num:3, titulo:"Pentecostés",                 fruto:"Amor a la Iglesia",      meditacion:"El Espíritu desciende como fuego. El mismo Espíritu vive en ti desde el bautismo. ¿Le dejas actuar?" },
    { num:4, titulo:"La Asunción de María",        fruto:"Gracia de la muerte santa", meditacion:"María entra en cuerpo y alma al cielo. Es la primicia de lo que espera a todos los que aman a Dios." },
    { num:5, titulo:"La Coronación de María",      fruto:"Perseverancia",          meditacion:"María, Reina del cielo y de la tierra. Nuestra Madre. Acude a ella siempre, especialmente cuando la lucha arrecia." },
  ]},
  luminosos: { nombre:"Misterios Luminosos",  dias:"Jueves",             color:"#8B6914", misterios:[
    { num:1, titulo:"El Bautismo en el Jordán",    fruto:"Apertura al Espíritu",   meditacion:"'Este es mi Hijo amado.' También tú eres hijo de Dios desde el bautismo. ¿Vives como quien sabe que es hijo del Rey?" },
    { num:2, titulo:"Las Bodas de Caná",           fruto:"A Jesús por María",      meditacion:"'Haced lo que Él os diga.' María siempre apunta hacia su Hijo. La devoción mariana lleva a Cristo." },
    { num:3, titulo:"El Anuncio del Reino",        fruto:"Conversión",             meditacion:"'Convertíos y creed en el Evangelio.' La conversión no es un momento: es una dirección permanente." },
    { num:4, titulo:"La Transfiguración",          fruto:"Deseo de santidad",      meditacion:"Pedro, Santiago y Juan ven la gloria de Cristo. Por un momento, la divinidad brilla. Eso te espera a ti también." },
    { num:5, titulo:"La Institución de la Eucaristía", fruto:"Adoración eucarística", meditacion:"'Tomad y comed.' Se queda. Cada Misa renueva el Calvario. La Eucaristía es el centro de la vida cristiana." },
  ]},
};

const ORACIONES_DIA = {
  manana: { titulo:"Oración de la mañana", icono:"🌅", textos:[
    { label:"Ofrecimiento de obras",  texto:"Señor mío y Dios mío, creo firmemente que estás aquí, que me ves, que me escuchas. Te adoro con profunda reverencia, te pido perdón de mis pecados y gracia para hacer con fruto este rato de oración. Madre mía Inmaculada, San José mi padre y señor, Ángel de mi guarda, interceded por mí." },
    { label:"Propósito del día",      texto:"Señor, te ofrezco este día entero: mis oraciones, trabajos, alegrías y sufrimientos, en unión con el Corazón de Jesús, por las intenciones de la Iglesia. Que todo lo de hoy sea para Ti." },
    { label:"Invocación a la Virgen", texto:"María, Madre mía, confío en ti este día. Que cada momento, cada trabajo, cada encuentro con otra persona sea una oración viva. Ayúdame a no perder a Dios de vista." },
  ]},
  noche: { titulo:"Oración de la noche", icono:"🌙", textos:[
    { label:"Acción de gracias", texto:"Señor, te doy gracias por este día. Por lo bueno que has puesto en él y que no he sabido ver del todo. Por las personas que me has dado, por el trabajo, por los momentos de gracia." },
    { label:"Contrición",        texto:"Señor, perdóname por lo que no ha sido como Tú querías. Por los momentos en que te he fallado, en que he antepuesto mi comodidad a tu amor. Me arrepiento y confío en tu misericordia." },
    { label:"Abandono en Dios",  texto:"En tus manos encomiendo mi espíritu, Señor. El día que termina, los que quiero, mis preocupaciones y mis miedos. Todo está mejor en tus manos que en las mías. Buenas noches, Padre." },
    { label:"A la Virgen",       texto:"Bajo tu amparo nos acogemos, santa Madre de Dios. No deseches las súplicas que te dirigimos en nuestras necesidades, antes bien líbranos de todos los peligros, Virgen gloriosa y bendita. Amén." },
  ]},
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
  { titulo:"La Cuaresma, tiempo de conversión",      tema:"Cuaresma",     color:C.burgundy,  resumen:"San Josemaría presenta la Cuaresma no como un tiempo de tristeza sino de esperanza activa. La penitencia no es fin en sí misma sino camino de amor.", citas:["«La penitencia cristiana no es pesimismo ni tristeza. Es precisamente lo contrario: es el camino para encontrar la alegría.»","«La mortificación es el reverso del amor. No se mortifica quien no ama, porque no tiene motivos para sacrificarse.»"], url:"https://opusdei.org/es-es/article/homilia-la-cuaresma/" },
  { titulo:"El dolor, parte del camino cristiano",   tema:"Cuaresma",     color:C.burgundy,  resumen:"Con gran realismo humano, san Josemaría aborda el dolor como realidad de la vida cristiana. El sufrimiento unido a la Cruz no es inútil: se convierte en fuente de gracia.", citas:["«No hay amor sin cruz, ni cruz sin amor. Si quieres seguir a Cristo de verdad, tendrás que cargar con tu cruz.»"], url:"https://opusdei.org/es-es/article/homilia-el-dolor-parte-del-camino-cristiano/" },
  { titulo:"Hacia la santidad",                      tema:"Cuaresma",     color:"#1e40af",   resumen:"La llamada universal a la santidad, corazón del espíritu del Opus Dei. Todo cristiano, en su vida ordinaria, está llamado a ser santo.", citas:["«La santidad no es para unos pocos privilegiados: es la vocación de todos los bautizados, en medio del mundo.»","«Santificad el trabajo ordinario; santificaos en el trabajo ordinario; santificad a los demás mediante el trabajo ordinario.»"], url:"https://opusdei.org/es-es/article/homilia-hacia-la-santidad/" },
  { titulo:"El Padre Dios",                          tema:"Cuaresma",     color:"#8B6914",   resumen:"Una de las homilías más hermosas de san Josemaría sobre la paternidad de Dios. La Cuaresma nos recuerda que somos hijos pródigos que volvemos al Padre.", citas:["«Dios es Padre. No un juez severo que espera para condenar, sino un Padre que espera para perdonar y abrazar.»","«La filiación divina es la base de la vida espiritual. Saber que soy hijo de Dios lo cambia todo.»"], url:"https://opusdei.org/es-es/article/homilia-el-padre-dios/" },
  { titulo:"La Eucaristía, misterio de fe y de amor",tema:"Semana Santa",  color:"#8B6914",   resumen:"El Jueves Santo y la institución de la Eucaristía. San Josemaría invita a vivir cada Misa como si fuera la primera, la última, la única.", citas:["«Asistir a la Misa con fe es participar en el Calvario. No como espectadores, sino como miembros del Cuerpo de Cristo.»"], url:"https://opusdei.org/es-es/article/homilia-la-eucaristia-misterio-de-fe-y-de-amor/" },
  { titulo:"El esplendor de la Cruz",                tema:"Semana Santa",  color:C.burgundy,  resumen:"La homilía del Viernes Santo por excelencia. San Josemaría contempla la Cruz no como derrota sino como victoria del amor.", citas:["«Que la Cruz sea siempre tu apoyo y tu camino, nunca tu obstáculo ni tu vergüenza.»","«El cristiano debe estar enamorado de la Cruz, porque está enamorado de Cristo.»"], url:"https://opusdei.org/es-es/article/homilia-el-esplendor-de-la-cruz/" },
  { titulo:"Cristo presente en los cristianos",      tema:"Semana Santa",  color:"#166534",   resumen:"Homilía sobre la Resurrección y sus consecuencias para la vida ordinaria. Cristo vive y actúa en los cristianos.", citas:["«La Resurrección de Cristo es el fundamento de nuestra fe. Sin ella, todo se desmorona.»","«Después de Pascua, el cristiano vive como quien sabe que la muerte ha sido vencida. Y eso se nota.»"], url:"https://opusdei.org/es-es/article/homilia-cristo-presente-en-los-cristianos/" },
  { titulo:"La vida de oración",                     tema:"Cuaresma",     color:C.burgundy,  resumen:"La oración como respiración del alma. San Josemaría insiste en la oración mental como conversación de amor con Dios, accesible a todos.", citas:["«La oración no es un deber penoso: es una conversación de amor con quien sabemos que nos quiere.»","«Un cuarto de hora de oración al día puede cambiarlo todo. Empieza hoy.»"], url:"https://opusdei.org/es-es/article/homilia-la-vida-de-oracion/" },
];

const SEMANA_SANTA = [
  { dia:"Domingo de Ramos",       fecha:"29 Mar", color:C.burgundy, icono:"🌿", espiritu:"Entramos en Jerusalén con Cristo. La multitud le aclama rey, pero en pocos días le abandonará. ¿Soy fiel a Cristo cuando va bien, y también cuando cuesta?",                                                          liturgia:"Bendición de ramos · Procesión · Pasión según Lucas", propuesta:"Lee despacio la Pasión según Lucas. Conserva tu ramo en casa todo el año.",                oracion:"Señor, que mi 'Hosanna' no se convierta en silencio cuando te persiguen.",          mortificacion:"Ayuno voluntario, ofrecido por alguien que no conoce a Cristo." },
  { dia:"Lunes Santo",            fecha:"30 Mar", color:C.burgundy, icono:"🕯️", espiritu:"María unge a Jesús con perfume costoso. Judas protesta. ¿En qué gastas lo mejor de ti? ¿Le das a Dios lo que te sobra o lo que más vale?",                                                                           liturgia:"Is 42, 1-7 · Jn 12, 1-11",                          propuesta:"Haz algo 'derrochador' por Dios: oración más larga, visita al Santísimo.",         oracion:"Que no regateé mi amor, Señor. Que te dé lo mejor.",                               mortificacion:"Silencio en redes sociales todo el día." },
  { dia:"Martes Santo",           fecha:"31 Mar", color:C.burgundy, icono:"⚔️", espiritu:"Jesús anuncia la traición de Judas y la negación de Pedro. Dos formas de fallar: una se hunde en la desesperación, la otra llora y vuelve. ¿Cómo respondes tú a tus fallos?",                                          liturgia:"Is 49, 1-6 · Jn 13, 21-33.36-38",                   propuesta:"Examina si hay algo que te aleje de Dios silenciosamente. Prepara tu confesión.", oracion:"Señor, que como Pedro, llore mis negaciones y vuelva a Ti.",                        mortificacion:"No te quejes de nada hoy. Ofrece todo en silencio." },
  { dia:"Miércoles Santo",        fecha:"1 Abr",  color:"#1a1010",  icono:"🌑", espiritu:"El día del silencio antes de la tormenta. Jesús se prepara. Invitación a más recogimiento interior.",                                                                                                                   liturgia:"Is 50, 4-9 · Mt 26, 14-25",                         propuesta:"Reduce al mínimo el ruido: pantallas, música, conversaciones innecesarias.",       oracion:"Señor, recógeme en Ti. Que este silencio sea encuentro.",                          mortificacion:"Ayuno de entretenimiento: sin series, redes, noticias." },
  { dia:"Jueves Santo",           fecha:"2 Abr",  color:"#8B6914",  icono:"🍞", espiritu:"La Última Cena. El lavatorio de pies. La institución de la Eucaristía. Esta noche, contempla el don de la Misa.",                                                                                                      liturgia:"Ex 12, 1-14 · 1Cor 11, 23-26 · Jn 13, 1-15",       propuesta:"Asiste a la Misa vespertina y a la adoración nocturna. 'Velad conmigo.'",          oracion:"Gracias, Señor, por quedarte. Por la Eucaristía. Por el sacerdocio.",              mortificacion:"Ayuno voluntario. Vela al menos 30 minutos ante el Santísimo." },
  { dia:"Viernes Santo",          fecha:"3 Abr",  color:C.burgundy, icono:"✝️", espiritu:"El día más sagrado del año. Cristo muere por ti. No hay Misa: solo la Liturgia de la Pasión y el silencio.",                                                                                                          liturgia:"Is 52-53 · Hb 4, 14-16 · Jn 18-19 · Veneración de la Cruz", propuesta:"Vía Crucis. Liturgia de la Pasión. Silencio de 12 a 3pm si puedes.",        oracion:"Señor, que nunca trivialice lo que costó tu amor. Gracias.",                       mortificacion:"Ayuno estricto. Abstinencia. Silencio interior todo el día." },
  { dia:"Sábado Santo",           fecha:"4 Abr",  color:"#0a0808",  icono:"🌑", espiritu:"El gran silencio. El sábado santo es el día en que Dios parece ausente. María sola mantiene la fe.",                                                                                                                    liturgia:"Vigilia Pascual por la noche · Bautismos",          propuesta:"Cuida el silencio hasta la Vigilia. Por la noche, asiste a la Vigilia Pascual.",   oracion:"María, danos tu fe inquebrantable cuando todo parece perdido.",                     mortificacion:"Silencio y recogimiento hasta la Vigilia." },
  { dia:"Domingo de Resurrección",fecha:"5 Abr",  color:"#8B6914",  icono:"☀️", espiritu:"¡Alleluia! Cristo ha resucitado. Todo cambia. La Cuaresma termina. Tu vida ordinaria tiene ahora una luz nueva. Sal a vivirla.",                                                                                      liturgia:"Hch 10, 34-43 · Col 3, 1-4 · Jn 20, 1-9",          propuesta:"Llama a alguien que esté solo. Comparte la alegría de la Pascua.",                 oracion:"Señor resucitado, renueva mi vida. Que la Pascua cambie cómo trabajo, amo y sirvo.", mortificacion:"Hoy no hay mortificación penitencial. La alegría es el deber del día." },
];

const CAMINO_QUOTES = [
  { num:418, texto:"No te desanimes. No te abandones a la tristeza. Si te dominas, si te niegas en todo lo que puedas, sin exageración, pero con constancia, tendrás paz." },
  { num:213, texto:"Lleva la Presencia de Dios. Eso solo hace santos." },
  { num:82,  texto:"¿Eres piedra angular de tu ambiente? —Si lo eres, no es para que el ambiente te aplaste, sino para que tú lo levantes." },
  { num:291, texto:"La Cruz en alto: así tienes que defenderla y propagarla." },
  { num:855, texto:"El optimismo apostólico no es una actitud beata. Es la lógica consecuencia de tu fe." },
  { num:278, texto:"Muchos se pierden porque no tienen nadie que rece por ellos." },
  { num:774, texto:"Trabaja. —No digas: mañana haré penitencia. Comienza ahora." },
  { num:58,  texto:"El camino del alma: Oración, Mortificación, Acción de gracias." },
];

// ─── HELPERS ────────────────────────────────────────────────────────────────

function getLentDay() {
  const today = new Date(); today.setHours(0,0,0,0);
  const start = new Date(LENT_START); start.setHours(0,0,0,0);
  const diff = Math.floor((today - start) / (1000*60*60*24));
  return (diff >= 0 && diff < 40) ? diff : 0;
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle, color }) {
  return (
    <div style={{ ...S.cardGold, marginBottom:16, background:`linear-gradient(145deg,${color || C.burgundy}18,${C.bgDeep})`, borderColor:`${color || C.burgundy}33` }}>
      <span style={S.label}>{icon} {title}</span>
      {subtitle && <p style={{ margin:0, fontStyle:"italic", color:C.creamFade, fontFamily:"'EB Garamond',serif", fontSize:14 }}>{subtitle}</p>}
    </div>
  );
}

function LinkRow({ icon, label, url, last }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      style={{ ...S.link, borderBottom: last ? "none" : `1px solid ${C.border}`, gap:10 }}>
      <span style={{ fontSize:18 }}>{icon}</span>
      <span style={{ flex:1 }}>{label}</span>
      <span style={{ color:C.goldDim, fontSize:13 }}>→</span>
    </a>
  );
}

// ─── TAB HOY ────────────────────────────────────────────────────────────────

function TabHoy({ dayData, todayIdx }) {
  const storageKey = `planvida_dia_${dayData.day}`;
  const [checked, setChecked] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });
  useEffect(() => {
    try { setChecked(JSON.parse(localStorage.getItem(`planvida_dia_${dayData.day}`) || "{}")); } catch { setChecked({}); }
  }, [dayData.day]);
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(checked)); } catch {}
  }, [checked]);
  const tc = k => setChecked(p => ({ ...p, [k]: !p[k] }));
  const sje = REFLEXIONES_SJE[(dayData.day - 1) % REFLEXIONES_SJE.length];

  return (
    <div>
      {/* Liturgia */}
      <div style={{ ...S.cardGold, marginBottom:16, background:`linear-gradient(145deg,${dayData.color}18,${C.bgDeep})`, borderColor:`${dayData.color}33` }}>
        <span style={{ ...S.label, color:C.gold }}>✦ Liturgia del día</span>
        <h2 style={{ margin:"0 0 8px", fontSize:20, ...S.title }}>{dayData.titulo}</h2>
        <div style={{ fontSize:14, color:C.creamFade, fontStyle:"italic", fontFamily:"'EB Garamond',serif" }}>{dayData.evangelio}</div>
        <div style={{ fontSize:12, color:C.goldDim, marginTop:4, fontFamily:"'Cinzel',serif", letterSpacing:1 }}>{dayData.santo}</div>
      </div>

      {/* Mortificación */}
      <div style={{ ...S.card, borderLeft:`3px solid ${C.gold}`, marginBottom:16 }}>
        <span style={S.label}>⚔️ Mortificación del día</span>
        <p style={{ margin:"0 0 14px", ...S.prose, fontStyle:"italic" }}>«{dayData.mortificacion}»</p>
        <button onClick={() => tc("mort")} style={{ ...S.btn(checked.mort, C.burgundy) }}>
          {checked.mort ? "✓ Ofrecida a Dios" : "Marcar como ofrecida"}
        </button>
      </div>

      {/* Evangelio */}
      <div style={{ ...S.card, marginBottom:16 }}>
        <span style={S.label}>📖 Evangelio del día · {dayData.evangelio}</span>
        <p style={{ margin:"0 0 14px", ...S.prose }}>{dayData.reflexion}</p>
        <a href="https://opusdei.org/es/page/evangelio-diario/" target="_blank" rel="noopener noreferrer"
          style={{ fontSize:12, color:C.goldMid, fontFamily:"'Cinzel',serif", letterSpacing:1, textDecoration:"none", textTransform:"uppercase" }}>
          Leer comentario completo en opusdei.org →
        </a>
      </div>

      {/* San Josemaría */}
      <div style={{ ...S.cardGold, marginBottom:16, borderLeft:`3px solid ${C.goldDim}` }}>
        <span style={S.label}>✦ San Josemaría · {sje.fuente}</span>
        <p style={{ margin:0, ...S.prose, fontStyle:"italic", fontSize:18 }}>«{sje.texto}»</p>
      </div>

      {/* Plan de Vida */}
      <div style={{ ...S.card, marginBottom:16 }}>
        <span style={S.label}>Plan de vida · Hoy</span>
        {[["or","Oración mental"],["mi","Santa Misa"],["ro","Rosario"],["le","Lectura espiritual"],["ex","Examen de conciencia"],["an","Ángelus / Regina Coeli"],["of","Ofrecimiento de obras"]].map(([k,l], i, arr) => (
          <div key={k} onClick={() => tc(k)}
            style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom: i < arr.length-1 ? `1px solid ${C.border}` : "none", cursor:"pointer" }}>
            <div style={{ width:20, height:20, borderRadius:4, border:`1px solid ${checked[k] ? C.gold : C.borderGold}`, background:checked[k] ? C.gold : "transparent", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, flexShrink:0, color:C.bg, transition:"all 0.2s" }}>
              {checked[k] && "✓"}
            </div>
            <span style={{ ...S.prose, fontSize:15, textDecoration:checked[k] ? "line-through" : "none", color:checked[k] ? C.creamFade : C.creamDim }}>{l}</span>
          </div>
        ))}
      </div>

      {/* Recursos */}
      <div style={S.card}>
        <span style={S.label}>Recursos</span>
        {[
          ["🕊️","Documentos del Papa León XIV","https://www.vatican.va/content/leo-xiv/es.html"],
          ["📿","Rosario en audio – Opus Dei","https://opusdei.org/es-es/article/santo-rosario-audio/"],
          ["🎙️","Podcast Opus Dei – Spotify","https://open.spotify.com/show/5RMEGzbevchHA9i6bD3hbg"],
          ["🙏","Vía Crucis de san Josemaría (audio)","https://opusdei.org/es/article/audio-via-crucis-de-san-josemaria/"],
        ].map(([ic,t,u], i, arr) => <LinkRow key={i} icon={ic} label={t} url={u} last={i===arr.length-1}/>)}
      </div>
    </div>
  );
}

// ─── TAB ORACIONES ──────────────────────────────────────────────────────────

function TabOraciones() {
  const [momento, setMomento] = useState("manana");
  const [expandido, setExpandido] = useState(null);
  const o = ORACIONES_DIA[momento];
  const col = momento === "manana" ? C.green : C.burgundy;
  return (
    <div>
      <SectionHeader icon={o.icono} title={o.titulo} subtitle="«La oración no es un deber penoso: es una conversación de amor con quien sabemos que nos quiere.» — San Josemaría" color={col}/>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <button onClick={() => { setMomento("manana"); setExpandido(null); }} style={{ ...S.btn(momento==="manana", C.green), flex:1 }}>🌅 Mañana</button>
        <button onClick={() => { setMomento("noche"); setExpandido(null); }} style={{ ...S.btn(momento==="noche", C.burgundy), flex:1 }}>🌙 Noche</button>
      </div>
      {o.textos.map((t, i) => (
        <div key={i} onClick={() => setExpandido(expandido===i ? null : i)}
          style={{ ...S.card, marginBottom:10, cursor:"pointer", borderColor: expandido===i ? `${col}66` : C.border }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontFamily:"'Cinzel',serif", fontSize:13, fontWeight:600, color: expandido===i ? C.gold : C.creamDim, letterSpacing:0.5 }}>{t.label}</span>
            <span style={{ color:C.creamFade, fontSize:14 }}>{expandido===i ? "▲" : "▼"}</span>
          </div>
          {expandido===i && <p style={{ margin:"14px 0 0", ...S.prose, fontStyle:"italic", lineHeight:2 }}>{t.texto}</p>}
        </div>
      ))}
      <div style={{ ...S.card, marginTop:8 }}>
        <span style={S.label}>Más oraciones del Opus Dei</span>
        {[["📿","Preces del Opus Dei","https://opusdei.org/es-es/article/preces/"],["🙏","Oraciones tradicionales","https://opusdei.org/es-es/article/oraciones-tradicion-cristiana/"],["📖","Angelus y Regina Coeli","https://opusdei.org/es-es/article/el-angelus/"]].map(([ic,t,u],i,arr)=><LinkRow key={i} icon={ic} label={t} url={u} last={i===arr.length-1}/>)}
      </div>
    </div>
  );
}

// ─── TAB ROSARIO ────────────────────────────────────────────────────────────

function TabRosario() {
  const [tipo, setTipo] = useState("dolorosos");
  const [activo, setActivo] = useState(0);
  const [comp, setComp] = useState({});
  const m = MISTERIOS_ROSARIO[tipo];
  const mis = m.misterios[activo];
  return (
    <div>
      <SectionHeader icon="📿" title="Santo Rosario" subtitle={`${m.nombre} · ${m.dias}`} color={m.color}/>
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {Object.entries(MISTERIOS_ROSARIO).map(([k,v]) => (
          <button key={k} onClick={() => { setTipo(k); setActivo(0); }} style={S.btn(tipo===k, v.color)}>{v.nombre.split(" ")[1]}</button>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        {m.misterios.map((_, i) => (
          <button key={i} onClick={() => setActivo(i)} style={{ width:36, height:36, borderRadius:"50%", border:`2px solid ${i===activo ? m.color : C.border}`, background:comp[`${tipo}_${i}`] ? m.color : i===activo ? C.bgCard : "transparent", color:i===activo||comp[`${tipo}_${i}`] ? "#fff" : C.creamFade, cursor:"pointer", fontSize:13, fontWeight:700, transition:"all 0.2s" }}>
            {comp[`${tipo}_${i}`] ? "✓" : i+1}
          </button>
        ))}
      </div>
      <div style={{ ...S.card, borderColor:`${m.color}44`, marginBottom:16 }}>
        <span style={{ ...S.label, color:m.color }}>Misterio {mis.num} · Fruto: {mis.fruto}</span>
        <h3 style={{ margin:"0 0 14px", fontSize:18, ...S.title }}>{mis.titulo}</h3>
        <p style={{ margin:"0 0 16px", ...S.prose }}>{mis.meditacion}</p>
        <div style={{ background:C.bgDeep, borderRadius:8, padding:"10px 14px", borderLeft:`3px solid ${m.color}`, fontSize:13, color:C.creamFade, fontFamily:"'EB Garamond',serif" }}>
          1 Padre Nuestro · 10 Ave Marías · 1 Gloria
        </div>
        <div style={{ display:"flex", gap:10, marginTop:14 }}>
          <button onClick={() => setActivo(Math.max(0, activo-1))} disabled={activo===0}
            style={{ flex:1, padding:"10px", background: activo===0 ? C.bgDeep : C.bgCard, border:`1px solid ${C.border}`, borderRadius:8, color: activo===0 ? C.creamFade : C.creamDim, cursor:activo===0?"default":"pointer", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:1 }}>
            ← ANTERIOR
          </button>
          <button onClick={() => { setComp(p=>({...p,[`${tipo}_${activo}`]:true})); if(activo<4) setActivo(activo+1); }}
            style={{ flex:1, padding:"10px", background:m.color, border:"none", borderRadius:8, color:"#fff", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:1 }}>
            {activo<4 ? "SIGUIENTE →" : "✓ COMPLETAR"}
          </button>
        </div>
      </div>
      <div style={{ ...S.card, textAlign:"center" }}>
        <LinkRow icon="📿" label="Rosario en audio con san Josemaría – Opus Dei" url="https://opusdei.org/es-es/article/santo-rosario-audio/" last/>
      </div>
    </div>
  );
}

// ─── TAB VÍA CRUCIS ─────────────────────────────────────────────────────────

function TabViacrucis() {
  const [est, setEst] = useState(0);
  const [done, setDone] = useState({});
  const e = VIA_CRUCIS[est];
  return (
    <div>
      <SectionHeader icon="✝️" title="Vía Crucis" subtitle="«Te aconsejo que hagas el Vía Crucis cada viernes.» — San Josemaría" color={C.burgundy}/>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
        {VIA_CRUCIS.map((_, i) => (
          <button key={i} onClick={() => setEst(i)} style={{ width:34, height:34, borderRadius:6, border:`1px solid ${i===est ? C.burLight : C.border}`, background:done[i] ? C.burgundy : i===est ? C.bgCard : "transparent", color:i===est||done[i] ? C.cream : C.creamFade, cursor:"pointer", fontSize:11, fontWeight:700, transition:"all 0.2s" }}>
            {done[i] ? "✓" : i+1}
          </button>
        ))}
      </div>
      <div style={{ ...S.card, borderLeft:`3px solid ${C.burgundy}`, marginBottom:14 }}>
        <div style={{ display:"flex", gap:14, alignItems:"center", marginBottom:16 }}>
          <div style={{ width:44, height:44, borderRadius:"50%", background:C.burgundy, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:17, color:C.cream, flexShrink:0, fontFamily:"'Cinzel',serif" }}>{est+1}</div>
          <div>
            <span style={S.label}>Estación {est+1}</span>
            <h3 style={{ margin:0, fontSize:17, ...S.title }}>{e.titulo}</h3>
          </div>
        </div>
        <p style={{ margin:"0 0 16px", ...S.prose }}>{e.meditacion}</p>
        <div style={{ background:C.bgDeep, borderRadius:8, padding:"12px 14px", borderLeft:`3px solid ${C.burLight}` }}>
          <span style={{ ...S.label, marginBottom:6 }}>Oración</span>
          <p style={{ margin:0, ...S.prose, fontStyle:"italic", fontSize:15 }}>«{e.oracion}»</p>
        </div>
        <p style={{ textAlign:"center", marginTop:12, fontSize:12, color:C.burgundy, fontStyle:"italic", fontFamily:"'EB Garamond',serif" }}>Te adoramos, Cristo, y te bendecimos, porque por tu Santa Cruz redimiste al mundo.</p>
      </div>
      <div style={{ display:"flex", gap:10, marginBottom:16 }}>
        <button onClick={() => setEst(Math.max(0,est-1))} disabled={est===0}
          style={{ flex:1, padding:"11px", background:est===0?C.bgDeep:C.bgCard, border:`1px solid ${C.border}`, borderRadius:8, color:est===0?C.creamFade:C.creamDim, cursor:est===0?"default":"pointer", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:1 }}>
          ← ANTERIOR
        </button>
        <button onClick={() => { setDone(p=>({...p,[est]:true})); if(est<13) setEst(est+1); }}
          style={{ flex:1, padding:"11px", background:C.burgundy, border:"none", borderRadius:8, color:"#fff", cursor:"pointer", fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:1 }}>
          {est<13 ? "SIGUIENTE →" : "✓ COMPLETAR"}
        </button>
      </div>
      <div style={S.card}>
        <LinkRow icon="🙏" label="Vía Crucis de san Josemaría en audio – Opus Dei" url="https://opusdei.org/es/article/audio-via-crucis-de-san-josemaria/" last/>
      </div>
    </div>
  );
}

// ─── TAB SEMANA SANTA ───────────────────────────────────────────────────────

function TabSemanaSanta() {
  const [dia, setDia] = useState(0);
  const d = SEMANA_SANTA[dia];
  return (
    <div>
      <SectionHeader icon="🌿" title="Semana Santa 2026" subtitle="«La Semana Santa es la semana del amor de Dios.» — San Josemaría" color={C.burgundy}/>
      <div style={{ display:"flex", gap:6, marginBottom:16, flexWrap:"wrap" }}>
        {SEMANA_SANTA.map((ss, i) => (
          <button key={i} onClick={() => setDia(i)} style={{ padding:"8px 10px", borderRadius:8, border:`1px solid ${i===dia ? ss.color : C.border}`, background:i===dia ? `${ss.color}22` : "transparent", color:i===dia ? C.cream : C.creamFade, cursor:"pointer", textAlign:"center", transition:"all 0.2s" }}>
            <div style={{ fontSize:15 }}>{ss.icono}</div>
            <div style={{ fontSize:10, fontFamily:"'Cinzel',serif", marginTop:2 }}>{ss.fecha}</div>
          </button>
        ))}
      </div>
      <div style={{ ...S.card, borderColor:`${d.color}44`, marginBottom:12 }}>
        <div style={{ display:"flex", gap:12, alignItems:"center", marginBottom:16 }}>
          <span style={{ fontSize:30 }}>{d.icono}</span>
          <div>
            <div style={{ fontSize:10, color:C.goldDim, letterSpacing:2, fontFamily:"'Cinzel',serif", textTransform:"uppercase" }}>{d.fecha}</div>
            <h3 style={{ margin:0, fontSize:19, ...S.title }}>{d.dia}</h3>
          </div>
        </div>
        <p style={{ margin:"0 0 14px", ...S.prose }}>{d.espiritu}</p>
        {[["Liturgia",d.liturgia,C.bgDeep,C.creamFade],["Propuesta práctica",d.propuesta,C.bgDeep,C.green+""+"88"],["Mortificación",d.mortificacion,C.bgDeep,C.burLight],["Oración del día",`«${d.oracion}»`,C.bgDeep,C.gold]].map(([t,c,bg,col])=>(
          <div key={t} style={{ background:bg, borderRadius:8, padding:"12px 14px", marginBottom:10, borderLeft:`3px solid ${col}` }}>
            <span style={{ ...S.label, color:col, marginBottom:5 }}>{t}</span>
            <p style={{ margin:0, fontSize:14, color:C.creamDim, fontFamily:"'EB Garamond',serif", lineHeight:1.7, fontStyle:t==="Oración del día"?"italic":"normal" }}>{c}</p>
          </div>
        ))}
      </div>
      {d.dia==="Domingo de Resurrección" && (
        <div style={{ ...S.cardGold, textAlign:"center", padding:"28px", background:"linear-gradient(135deg,#1a1000,#0e0c07)" }}>
          <div style={{ fontSize:36, marginBottom:8 }}>☀️</div>
          <div style={{ fontSize:20, fontWeight:700, color:C.gold, marginBottom:6, fontFamily:"'Cinzel',serif" }}>¡Alleluia! ¡Cristo ha resucitado!</div>
          <p style={{ margin:0, fontStyle:"italic", color:C.cream, fontFamily:"'EB Garamond',serif" }}>La Cuaresma ha terminado. Vive la Pascua cada día.</p>
        </div>
      )}
    </div>
  );
}

// ─── TAB HOMILÍAS ───────────────────────────────────────────────────────────

function TabHomilias() {
  const [filtro, setFiltro] = useState("Todos");
  const [abierta, setAbierta] = useState(null);
  const filtradas = filtro==="Todos" ? HOMILIAS_ECP : HOMILIAS_ECP.filter(h=>h.tema===filtro);
  return (
    <div>
      <SectionHeader icon="📚" title="Homilías de «Es Cristo que Pasa»" subtitle="San Josemaría para este tiempo litúrgico" color={C.burgundy}/>
      <div style={{ display:"flex", gap:6, marginBottom:16 }}>
        {["Todos","Cuaresma","Semana Santa"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={S.btn(filtro===f)}>{f}</button>
        ))}
      </div>
      {filtradas.map((h, i) => (
        <div key={i} style={{ ...S.card, marginBottom:10, cursor:"pointer", borderColor:abierta===i?`${h.color}44`:C.border }} onClick={() => setAbierta(abierta===i?null:i)}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div style={{ flex:1 }}>
              <span style={{ ...S.label, color:h.color }}>{h.tema}</span>
              <h3 style={{ margin:"0 0 6px", fontSize:16, ...S.title }}>{h.titulo}</h3>
            </div>
            <span style={{ color:C.creamFade, fontSize:16, marginLeft:12 }}>{abierta===i?"▲":"▼"}</span>
          </div>
          {abierta===i && (
            <div style={{ marginTop:14 }}>
              <p style={{ margin:"0 0 14px", ...S.prose }}>{h.resumen}</p>
              <div style={{ background:C.bgDeep, borderRadius:8, padding:"14px", marginBottom:12 }}>
                {h.citas.map((c,ci) => <p key={ci} style={{ margin:"0 0 8px", ...S.prose, fontStyle:"italic", color:C.gold, fontSize:15 }}>{c}</p>)}
              </div>
              <a href={h.url} target="_blank" rel="noopener noreferrer"
                style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"9px 16px", background:h.color, borderRadius:8, textDecoration:"none", color:"#fff", fontSize:11, fontFamily:"'Cinzel',serif", letterSpacing:1, textTransform:"uppercase" }}>
                Leer homilía completa →
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── TAB MISAS ──────────────────────────────────────────────────────────────

function TabMisas() {
  const [busqueda, setBusqueda] = useState("");
  const url = busqueda.trim() ? `https://www.misas.org/horario-de-misas/?q=${encodeURIComponent(busqueda)}` : "https://www.misas.org";
  return (
    <div>
      <SectionHeader icon="⛪" title="Horarios de Misa en España" subtitle="Fuente: misas.org — horarios actualizados de toda España." color={C.green}/>
      <div style={{ position:"relative", marginBottom:12 }}>
        <input value={busqueda} onChange={e=>setBusqueda(e.target.value)} placeholder="Escribe tu ciudad o barrio..."
          style={{ width:"100%", padding:"13px 16px 13px 44px", background:C.bgDeep, border:`1px solid ${C.borderGold}`, borderRadius:10, color:C.cream, fontSize:16, fontFamily:"'EB Garamond',serif", outline:"none", boxSizing:"border-box" }}/>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color:C.creamFade, fontSize:20 }}>🔍</span>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"14px", background:C.green, borderRadius:10, textDecoration:"none", color:"#fff", fontSize:14, fontFamily:"'Cinzel',serif", fontWeight:600, letterSpacing:1, marginBottom:20, textTransform:"uppercase" }}>
        <span>⛪</span>
        <span>{busqueda.trim() ? `Buscar misas en "${busqueda}"` : "Ver misas cerca de mí"} →</span>
      </a>
      <div style={S.card}>
        <span style={S.label}>Recurso externo</span>
        <LinkRow icon="🗺️" label="misas.org — horarios de Misa en España" url="https://www.misas.org" last/>
      </div>
    </div>
  );
}

// ─── TAB EXAMEN ─────────────────────────────────────────────────────────────

function TabExamen() {
  const [ans, setAns] = useState({});
  const resps = { "sí":C.green, "no":C.burgundy, "a medias":C.goldDim };
  return (
    <div>
      <SectionHeader icon="🔍" title="Examen de Conciencia" subtitle="«Examínate al final de la jornada.» — San Josemaría" color={C.burgundy}/>
      {EXAMENES.map((p, i) => (
        <div key={i} style={{ marginBottom:10, padding:"14px", background:C.bgCard, borderRadius:12, borderLeft:`3px solid ${resps[ans[i]] || C.border}`, border:`1px solid ${C.border}`, borderLeft:`3px solid ${resps[ans[i]] || C.borderGold}` }}>
          <p style={{ margin:"0 0 10px", ...S.prose, fontSize:15 }}>{i+1}. {p}</p>
          <div style={{ display:"flex", gap:6 }}>
            {["sí","no","a medias"].map(o => (
              <button key={o} onClick={() => setAns(a=>({...a,[i]:o}))} style={{ ...S.btn(ans[i]===o, resps[o]), fontSize:10 }}>{o}</button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ ...S.cardGold, marginTop:16, textAlign:"center", padding:"20px" }}>
        <span style={S.label}>Acto de contrición</span>
        <p style={{ margin:0, ...S.prose, fontStyle:"italic", fontSize:15 }}>Señor mío Jesucristo, Dios y Hombre verdadero, me pesa de todo corazón haberte ofendido... Dame tu gracia para no volver a pecar.</p>
      </div>
    </div>
  );
}

// ─── TAB NOTAS ──────────────────────────────────────────────────────────────

function TabNotas({ dayData }) {
  const [notas, setNotas] = useState(() => { try { return JSON.parse(localStorage.getItem("cuaresma_notas")||"{}"); } catch { return {}; } });
  const [texto, setTexto] = useState(notas[dayData.day]||"");
  const [guardado, setGuardado] = useState(false);
  useEffect(() => { setTexto(notas[dayData.day]||""); }, [dayData.day]);
  function guardar() {
    const nuevas = {...notas,[dayData.day]:texto};
    setNotas(nuevas);
    try { localStorage.setItem("cuaresma_notas",JSON.stringify(nuevas)); } catch {}
    setGuardado(true); setTimeout(()=>setGuardado(false),2000);
  }
  const diasConNotas = Object.keys(notas).filter(k=>notas[k]?.trim());
  return (
    <div>
      <SectionHeader icon="📝" title={`Notas · Día ${dayData.day}`} subtitle={`${dayData.titulo} — ${dayData.fecha}`} color={C.burgundy}/>
      <div style={{ ...S.card, marginBottom:16 }}>
        <textarea value={texto} onChange={e=>setTexto(e.target.value)}
          placeholder="Escribe aquí tu moción de hoy, lo que el Señor te ha dicho en la oración, una resolución..."
          style={{ width:"100%", minHeight:180, background:C.bgDeep, border:`1px solid ${C.borderGold}`, borderRadius:8, color:C.cream, fontSize:16, fontFamily:"'EB Garamond',serif", padding:"14px", boxSizing:"border-box", outline:"none", lineHeight:1.8, resize:"vertical" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:10 }}>
          <span style={{ fontSize:12, color:guardado ? "#4a9e6a" : C.creamFade, fontFamily:"'Cinzel',serif", letterSpacing:1 }}>{guardado ? "✓ GUARDADO" : "Se guarda en este dispositivo"}</span>
          <button onClick={guardar} style={{ ...S.btn(true, C.burgundy) }}>Guardar</button>
        </div>
      </div>
      {diasConNotas.length > 0 && (
        <div style={S.card}>
          <span style={S.label}>Días con reflexiones guardadas</span>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {diasConNotas.map(d => (
              <div key={d} style={{ background:C.bgDeep, border:`1px solid ${C.borderGold}`, borderRadius:6, padding:"5px 10px", fontSize:11, color:C.gold, fontFamily:"'Cinzel',serif", letterSpacing:1 }}>
                DÍA {d}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TAB CALENDARIO ─────────────────────────────────────────────────────────

function TabCalendario({ selectedDay, setSelectedDay, setTab, todayIdx }) {
  return (
    <div>
      <SectionHeader icon="📅" title="Los 40 días de Cuaresma 2026" color={C.burgundy}/>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))", gap:8 }}>
        {LENT_DAYS.map((d, i) => (
          <button key={i} onClick={() => { setSelectedDay(i); setTab("hoy"); }}
            style={{ background: i===selectedDay ? C.burgundy : C.bgCard, border:`1px solid ${i===selectedDay ? C.burLight : i===todayIdx ? C.borderGold : C.border}`, borderRadius:10, padding:"12px 10px", cursor:"pointer", textAlign:"left", transition:"all 0.2s" }}>
            <div style={{ fontSize:10, color: i===selectedDay ? C.cream : C.creamFade, fontFamily:"'Cinzel',serif", letterSpacing:1, marginBottom:2 }}>{d.fecha}</div>
            <div style={{ fontSize:11, color: i===selectedDay ? "#fff" : C.gold, fontWeight:600, fontFamily:"'Cinzel',serif" }}>Día {d.day}</div>
            <div style={{ fontSize:11, color: i===selectedDay ? C.cream : C.creamFade, lineHeight:1.3, marginTop:2 }}>{d.titulo}</div>
            {i===todayIdx && <div style={{ fontSize:9, color:"#4a9e6a", marginTop:4, letterSpacing:2, fontFamily:"'Cinzel',serif" }}>● HOY</div>}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── TAB CAMINO ─────────────────────────────────────────────────────────────

function TabCamino() {
  return (
    <div>
      <SectionHeader icon="📖" title="Puntos de «Camino»" subtitle="San Josemaría Escrivá de Balaguer" color={C.burgundy}/>
      <div style={{ ...S.card, marginBottom:16 }}>
        {CAMINO_QUOTES.map((q, i) => (
          <div key={i} style={{ padding:"18px 0 18px 18px", borderBottom: i<CAMINO_QUOTES.length-1 ? `1px solid ${C.border}` : "none", borderLeft:`2px solid ${C.goldDim}`, marginLeft:0, paddingLeft:18 }}>
            <span style={{ ...S.label, marginBottom:6 }}>N.º {q.num}</span>
            <p style={{ margin:0, ...S.prose, fontStyle:"italic", fontSize:18 }}>«{q.texto}»</p>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <span style={S.label}>Recursos Opus Dei</span>
        {[["📖","opusdei.org – Espiritualidad","https://opusdei.org/es-es/"],["✦","San Josemaría – Textos y homilías","https://opusdei.org/es-es/section/san-josemaria/"],["🙏","Preparación para la confesión","https://opusdei.org/es-es/article/confesion/"]].map(([ic,t,u],i,arr)=><LinkRow key={i} icon={ic} label={t} url={u} last={i===arr.length-1}/>)}
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
    ["misas","⛪","Misas"],
    ["oraciones","🙏","Oraciones"],
    ["rosario","📿","Rosario"],
    ["examen","🔍","Examen"],
    ["notas","📝","Notas"],
    ["homilias","📚","Homilías"],
    ["viacrucis","✝️","Vía Crucis"],
    ["semanasanta","🌿","Semana Santa"],
    ["calendario","📅","Calendario"],
    ["camino","📖","Camino"],
  ];

  return (
    <div style={S.wrap}>
      <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap" rel="stylesheet"/>

      {/* Cruz de fondo */}
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, opacity:0.035, pointerEvents:"none", zIndex:0 }}>
        <svg viewBox="0 0 100 100"><rect x="45" y="5" width="10" height="90" fill="#c9a84c"/><rect x="15" y="30" width="70" height="10" fill="#c9a84c"/></svg>
      </div>
      <div style={{ position:"fixed", bottom:0, left:0, right:0, height:120, background:"linear-gradient(to top,rgba(201,168,76,0.03),transparent)", pointerEvents:"none", zIndex:0 }}/>

      {/* Header */}
      <div style={{ background:`linear-gradient(180deg,#1a1408 0%,${C.bg} 100%)`, borderBottom:`1px solid ${C.borderGold}`, padding:"18px 20px 0", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:680, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <div>
              <div style={{ fontSize:9, letterSpacing:4, color:C.goldDim, fontFamily:"'Cinzel',serif", textTransform:"uppercase", marginBottom:3 }}>✦ Anno Domini MMXXVI ✦</div>
              <h1 style={{ margin:0, fontSize:20, fontWeight:700, letterSpacing:1, fontFamily:"'Cinzel',serif", color:C.cream }}>Cuaresma 2026</h1>
            </div>
            <div style={{ background:"linear-gradient(135deg,#1a1408,#0e0c07)", border:`1px solid ${C.borderGold}`, borderRadius:10, padding:"8px 16px", textAlign:"center", boxShadow:`0 0 12px rgba(201,168,76,0.08)` }}>
              <div style={{ fontSize:22, fontWeight:700, color:C.gold, fontFamily:"'Cinzel',serif" }}>Día {dayData.day}</div>
              <div style={{ fontSize:9, color:C.goldDim, letterSpacing:2, fontFamily:"'Cinzel',serif", textTransform:"uppercase" }}>{dayData.fecha}</div>
            </div>
          </div>
          {/* Barra de progreso */}
          <div style={{ marginBottom:12 }}>
            <div style={{ height:2, background:C.border, borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${Math.round((todayIdx/39)*100)}%`, background:`linear-gradient(90deg,${C.goldDim},${C.gold})`, borderRadius:2 }}/>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
              <span style={{ fontSize:10, color:C.creamFade, fontFamily:"'Cinzel',serif" }}>Día {todayIdx+1} de 40</span>
              <span style={{ fontSize:10, color:C.creamFade, fontFamily:"'Cinzel',serif" }}>{39-todayIdx} días para Pascua</span>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display:"flex", gap:3, overflowX:"auto", paddingBottom:12, scrollbarWidth:"none", msOverflowStyle:"none" }}>
            {TABS.map(([id,ic,label]) => (
              <button key={id} onClick={() => setTab(id)} style={{
                ...S.btn(tab===id),
                display:"flex", alignItems:"center", gap:5, whiteSpace:"nowrap", padding:"8px 12px",
                background: tab===id ? `linear-gradient(135deg,${C.burgundy},#5a1020)` : "transparent",
                borderColor: tab===id ? `${C.burLight}44` : C.border,
                boxShadow: tab===id ? `0 0 10px rgba(124,29,46,0.25)` : "none",
              }}>
                <span style={{ fontSize:13 }}>{ic}</span>
                <span style={{ fontSize:10 }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth:680, margin:"0 auto", padding:"20px 16px 48px", position:"relative", zIndex:1 }}>
        {tab==="hoy"         && <TabHoy dayData={dayData} todayIdx={todayIdx}/>}
        {tab==="misas"       && <TabMisas/>}
        {tab==="oraciones"   && <TabOraciones/>}
        {tab==="rosario"     && <TabRosario/>}
        {tab==="examen"      && <TabExamen/>}
        {tab==="notas"       && <TabNotas dayData={dayData}/>}
        {tab==="homilias"    && <TabHomilias/>}
        {tab==="viacrucis"   && <TabViacrucis/>}
        {tab==="semanasanta" && <TabSemanaSanta/>}
        {tab==="calendario"  && <TabCalendario selectedDay={selectedDay} setSelectedDay={setSelectedDay} setTab={setTab} todayIdx={todayIdx}/>}
        {tab==="camino"      && <TabCamino/>}

        <div style={{ textAlign:"center", marginTop:40, paddingTop:24, borderTop:`1px solid ${C.borderGold}` }}>
          <div style={{ fontSize:9, letterSpacing:3, color:C.goldDim, fontFamily:"'Cinzel',serif", textTransform:"uppercase", marginBottom:8 }}>✦ ✦ ✦</div>
          <div style={{ fontSize:17, color:C.creamFade, fontStyle:"italic", fontFamily:"'EB Garamond',serif" }}>«Dios te espera cada día. ¡No le faltes!»</div>
          <div style={{ fontSize:11, color:C.goldDim, marginTop:4, fontFamily:"'Cinzel',serif", letterSpacing:1, textTransform:"uppercase" }}>San Josemaría Escrivá</div>
        </div>
      </div>
    </div>
  );
}
