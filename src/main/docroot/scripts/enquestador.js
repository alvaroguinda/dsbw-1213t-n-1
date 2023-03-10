//Map de les seccions de la web cap als <DIV>s que les contenen:
var secc = {
    Inici : "inici",
    CrearEnquesta : "crearEnquesta",
    ObtindreEnquesta : "getEnquesta",
    Enquestes : "veureEnquesta",
    Registre : "registre",
    Contacte : "contactar",
    LlistatEnquestes : "llistatEnq",
    Respondre: "respondEnq",
    veureRespostes: "veureRespostes"
};

var domini = "http://" + location.host + "/";

//Funció per carregar el contingut de cada secció dinamicament:
var carregaSeccio = function(nomSeccio,data){
    var id = "";
    $("#sectionContainer > div").addClass("template"); //Ocultem totes les seccions
    if(!nomSeccio){ //si no hem rebut arguments per carregar una determinada secció...
        var path = location.pathname.substring(1).split("/")[0]; //capturem el path contingut a la url
        switch (path){
            case "Enquestes":
                if(location.pathname.substring(1).split("/")[2] == "veureRespostes"){ //en cas que refresquem en veure respostes, ens porta a l'enquesta
                    window.location = domini+location.pathname.substring(1).split("/")[0]+"/"+location.pathname.substring(1).split("/")[1];
                    break;
                }
                id = location.pathname.substring(1).split("/")[1].substring(3);
                if(id != "") getEnquestaURL(id);
                break;
            case "LlistatEnquestes":
                getLlistatEnquestes();
                break;
            case "Respondre":
                id = location.pathname.substring(1).split("/")[1].substring(3);

                var idUser = "0";
                if(location.pathname.split("/")[3] != null) {
                  idUser = location.pathname.substring(1).split("/")[2].substring(4);                  
                }
                //console.log(idUser);
                if(id != "") getEnquestaRespondre(id, idUser);
                break;
            default:
                if(path == "") //si aquet path no existeix al nostre Map es que estem entrant per primer cop a la web i la url té el path en blanc o és "index.html"
                    path = "Inici";
                configuraSeccio(data); //configurem els handlers d'aquesta secció
                history.pushState({page:path}, path, domini+path+"/"); //modifiquem la url de la web + l'historic associat del navegador
        }
        $("#"+secc[path]).removeClass("template"); //mostrem la secció segons el path
        validaSeccio();
    }
    else { //si hem rebut arguments es tracta d'un click a un botó que ha de conduir a una determinada secció
        if(data && data.id) id = "Enq"+data.id+"/"; //si rebem l'id d'una enquesta el concatenarem a la URL
        if(nomSeccio == "veureRespostes"){ //cas en que volem veure les respostes a una enquesta
          history.pushState({page:nomSeccio}, location.pathname.substring(1).split("/")[0]+"/"+location.pathname.substring(1).split("/")[1]+"/"+nomSeccio, domini+location.pathname.substring(1).split("/")[0]+"/"+location.pathname.substring(1).split("/")[1]+"/"+nomSeccio);
        }
        else history.pushState({page:nomSeccio}, nomSeccio, domini+nomSeccio+"/"+id); //modifiquem la url de la web + l'historic associat del navegador
        $("#"+secc[nomSeccio]).removeClass("template"); //mostrem la secció nomSeccio

        var path = location.pathname.substring(1).split("/")[0]; //capturem el path contingut a la url
        if(path == "LlistatEnquestes") getLlistatEnquestes();
        else configuraSeccio(data); //configurem els handlers d'aquesta secció
    }
};

//Funcio que valida tots els formularis que tenen la classe validarFormulari
var validaSeccio = function() {
  //Si es un formulari amb validacions

  //Si existeix algun formulari per validar que no estigui amb la classe template fem la validacio
  if($(".contentContainer").find(".validarFormulari").length > 0) {
    $(".contentContainer").find(".validarFormulari").each(function() {
      //Si esta amagat no fem la validacio
      if($(this).parent('.template').length == 0) {
        validaFormulari($(this).attr('id'));
      }
    });
  }
}

// Retorna el "value" del parametre amb la key "name" contingut a la URL:
function gup( name ) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( window.location.href );
    if( results == null )
        return "";
    else
        return results[1];
}

// Retorna un Map de tots els parametres continguts a la URL:
function getUrlVars(){
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


// Retorna la enquesta amb ID id en format JSON:
function getEnquestaURL(id){
    $.ajax({
        type: "GET",
        url: "/api/enquestes/admin0/enq"+id,
        success: function(enquesta) {
           // alert(enquesta);
            configuraSeccio(enquesta); //configurem els handlers d'aquesta secció
        },
        dataType: "json",
        error: function(enquesta) {
            console.log("Error!");
        }
    });
}

function gePreguntaEnquesta(idEnquesta, idPregunta) {
  $.ajax({
        type: "GET",
        url: "/api/enquestes/admin0/enq"+id+"/preg"+idPregunta,
        success: function(enquesta) {
           // alert(enquesta);
            configuraSeccio(enquesta); //configurem els handlers d'aquesta secció
        },
        dataType: "json",
        error: function(enquesta) {
            console.log("Error!");
        }
    });
}

// Retorna la enquetsa amb idResp id en format JSON:
function getEnquestaRespondre(id, idUser){
    $.ajax({
        type: "GET",
        url: "/api/enquestes/user"+idUser+"/enq"+id,
        success: function(enquesta) {  
            configuraSeccio(enquesta); //configurem els handlers d'aquesta secció
        },
        dataType: "json",
        error: function(enquesta) {
            console.log("Error!");
        }
    });
}

// Retorna la enquesta amb ID id en format JSON:
function deletePregunta(idEnq,idPreg){
   $.alert("Estas segur que vols eliminar aquesta pregunta?", {
    title:'Eliminar pregunta.',
    icon:'',
    buttons:[
      {
        title:'Si',
        callback:function() { 
          $(this).dialog("close");
          $.ajax({
            type: "DELETE",
            url: "/api/enquestes/admin0/enq"+idEnq+"/preg"+idPreg,
            success: function(enquesta) {
                //location.reload();
                //console.log(enquesta);
                messageContainer("Success");
                configuraEstat(0, 0, 0);
                pintaPreguntes(enquesta);
            },
            dataType: "json",
            error: function() {
                messageContainer("Fail");
                //console.log("Error!");
            }
          });
        ;}
      },
      {
        title:'No',
        callback:function(){$(this).dialog("close");}
      }
    ]
  });
}

function modPregunta(idEnq,idPreg) {
  var preguntaEnquesta = "";
  $.ajax({
      type: "GET",
      url: "/api/enquestes/admin0/enq"+idEnq+"/preg"+idPreg,
      success: function(pregunta) {      
          formulariModPregunta(idEnq, pregunta)
          //configuraSeccio(enquesta); //configurem els handlers d'aquesta secció
      },
      dataType: "json",
      error: function(pregunta) {
          console.log("Error!");
      }
  });
}

function formulariModPregunta(idEnq, pregunta) {
  var divModificaPregunta = "<div id='modificaPregunta'>";
  var checked = "";

  divModificaPregunta +="<form action='#' id='formModificaPregunta' class='formModificaPregunta validarFormulari' data-ajax-id='"+pregunta.id+"''>";
      divModificaPregunta +="<div class='divFormulari'>";
          divModificaPregunta +="<h3>Modifica la pregunta</h3>";
          divModificaPregunta +="<div class='inputdata'>";
              divModificaPregunta +="<label for='titolPreguntaModifica'>Pregunta</label>";
              divModificaPregunta +="<span><input type='text' name='titolPregunta' id='titolPreguntaModifica' class='required' value='"+pregunta.text+"'></span>";
          divModificaPregunta +="</div>";

          divModificaPregunta +="<div class='inputdata'>";
              divModificaPregunta +="<label for='rbTipusTextModifica'>Text</label>";
              if(pregunta.tipus == "Text") {
                  checked = "checked='true'"
              }
              else checked = ""
              divModificaPregunta +="<span><input type='radio' name='tipusPregunta' id='rbTipusTextModifica' value='Text' "+checked+"/> </span>";
          divModificaPregunta +="</div>";

          divModificaPregunta +="<div class='inputdata'>";
              divModificaPregunta +="<label for='rbTipusTestModifica'>Test</label>";
              if(pregunta.tipus == "Test") {
                  checked = "checked='true'"
              }
              else checked = ""
              divModificaPregunta +="<span><input type='radio' name='tipusPregunta' id='rbTipusTestModifica' value='Test' "+checked+"></span>";
          divModificaPregunta +="</div>";

          divModificaPregunta +="<div class='inputdata'>";
              divModificaPregunta +="<label for='rbTipusMultiModifica'>Multi</label>";
              if(pregunta.tipus == "Multi") {
                  checked = "checked='true'"
              }
              else checked = ""
              divModificaPregunta +="<span><input type='radio' name='tipusPregunta' id='rbTipusMultiModifica' value='Multi' "+checked+"></span>";
          divModificaPregunta +="</div>";
          var teRespostes = "class='template'";
          if(pregunta.possiblesRespostes.length > 0) {
            teRespostes="";
          }
          divModificaPregunta +="<div id='preguntaTestModifica' "+teRespostes+">";
              divModificaPregunta +="<h4>Respostes</h4>";
              
              var numResposta = pregunta.possiblesRespostes.length;

              divModificaPregunta +="<div id='divAfegirRespostaModifica'>";
              divModificaPregunta +="<input type='hidden' id='numRespostaModifica' value='"+numResposta+"'/>";
              var num=1;
              $(pregunta.possiblesRespostes).each(function(index, value){                  
                  divModificaPregunta +="<div class='inputdata'>";
                      divModificaPregunta +="<label for='respostaPreguntaModifica"+num+"'>Resposta</label>";
                      divModificaPregunta +="<span><input type='text' name='respostaPregunta"+num+"' id='respostaPreguntaModifica"+num+"' value='"+value+"' class='respostaPregunta required'></span>";
                      divModificaPregunta += "<img src='/img/delete.png' id='eliminaRespostaModifica" + num + "' class='deleteResposta deleteRespostaModifica' alt='Elimina resposta' title='Elimina Resposta' />";
                  divModificaPregunta +="</div>";
                  num++;
              });
              divModificaPregunta +="</div>";
                  
              divModificaPregunta +="<div id='divAfegirNovaRespostaModifica'></div>";

              divModificaPregunta +="<div id='divAfegirRespostaBotoModifica' class='boto'>";
                  divModificaPregunta +="<input type='button' id='bAfegirRespostaModifica' name='bAfegirRespostaModifica' value='Afegir resposta'>";
              divModificaPregunta +="</div>";
          divModificaPregunta +="</div>";
      divModificaPregunta +="</div>";
  divModificaPregunta +="</form>";

  divModificaPregunta +="</div>";

  $.alert(divModificaPregunta, {
    title:"A través d'aquest formulari pot modificar la pregunta de l'Enquesta                                                    ",
    icon:'',
    width: '60%',
    load: 1,
    onOpen: function() { 
      Events.initModificaPregunta();
      Events.allBotonsDeleteRespostesModifica();
    },
    buttons:[
        {
          title:'Desa',
          callback: function() {
            $(this).dialog("close");
            desaModificaPregunta(event);            
          }
        }
    ]
  });
}

function desaModificaPregunta(event) {
  var formulari = $(event.target).closest(".ui-dialog").find('.formModificaPregunta');

  enquestaId = location.pathname.substring(1).split("/")[1].substring(3);
  idPregunta = $(formulari).attr('data-ajax-id');

  var isValidate=$("#formModificaPregunta").valid();

  if(isValidate) {
    var respostesP = new Array();
    var respostesN = new Array();
    var respostesM = new Array();
    var faltenRespostes = false;

    if($(formulari).find('input[name=tipusPregunta]:checked').val() != "Text") {
      if( $(formulari).find("#divAfegirRespostaModifica input[type=text]").length <= 0 && $(formulari).find("#divAfegirNovaRespostaModifica input[type=text]").length <= 0) {
        faltenRespostes = true;
      }
      $(formulari).find("#divAfegirRespostaModifica input[type=text]").each(function(index){
        if($(this).val() != "") {
          respostesP[index] = $(this).val();          
        }
      });


      $(formulari).find("#divAfegirNovaRespostaModifica input[type=text]").each(function(index){
        if($(this).val() != "") {
          respostesN[index] = $(this).val();          
        }
      });

      respostesM = respostesP.concat(respostesN);
    }

    var pregunta = {
        tipus: $(formulari).find('input[name=tipusPregunta]:checked').val(),
        enunciat: $(formulari).find("input#titolPreguntaModifica").val(),
        respostes: respostesM
    }

    if(pregunta.enunciat.length > 0 && faltenRespostes == false) {
      $.ajax({
          type: "PUT",
          url: "/api/enquestes/admin0/enq"+enquestaId+"/preg"+idPregunta,
          contentType: "application/json",
          data: JSON.stringify(pregunta),
          success: function(enquesta){
              messageContainer("Success");
              $("#divAfegirNovaResposta").empty();
              $('#numResposta').val('1');
              configuraEstat(0, 0, 0);
              pintaPreguntes(enquesta);
          },
          error: function(){
              messageContainer("Fail");
          }
      });
    }
    else messageContainer("Fail");
  }
}

function ordenaPreguntes(event) {
  var enquestaId = location.pathname.substring(1).split("/")[1].substring(3);
  var idPregunta = -1;
  var tipus = "";
  var enunciat ="";
  var respostesP;
  var preguntesO = new Array();
  var posicio = 1;
  $(event.target).closest("#divPreguntes").find(".divFilaPregunta").each(function(index) {
    idPregunta = $(this).attr("data-ajax-id");
    tipus = $(this).attr("data-ajax-tipus");
    enunciat = $(this).find(".divContingutPregunta input[id^='contingutPregunta']").val();

    respostesP = new Array();

    $(this).find(".divFilaPossiblesRespostes input[type=text]").each(function(indexR){
      if($(this).val() != "") {
        respostesP[indexR] = $(this).val();
      }
    });

    if(respostesP[0] == "") respostesP = null;

    var pregunta = {
        id: idPregunta,
        tipus: tipus,
        enunciat: enunciat,
        respostes: respostesP
    }

    preguntesO[index] = pregunta;


    $("#pPregunta"+idPregunta).text("Pregunta "+posicio)
    posicio++;
       
  });

  var ordre = {
    preguntes: preguntesO
  }

  $.ajax({
        type: "PUT",
        url: "/api/enquestes/ordre/admin0/enq"+enquestaId,
        contentType: "application/json",
        data: JSON.stringify(ordre),
        success: function(){
            messageContainer("Success");
        },
        error: function(){
            messageContainer("Fail");
        }
    }); 
}

function veureRespostes(idEnq,idUser){
   $.ajax({
        type: "GET",
        url: "/api/enquestes/user"+idUser+"/enq"+idEnq+"/respostes",
        success: function(enquesta) {      
            posaRespostesUser(enquesta);
            //configuraSeccio(enquesta); //configurem els handlers d'aquesta secció
        },
        dataType: "json",
        error: function(enquesta) {
            console.log("Error!");
        }
    });
}

function getLlistatEnquestes(){
    $.ajax({
        type: "GET",
        url: "/api/enquestes",
        success: function(enquestes) {
            configuraSeccio(enquestes); //configurem els handlers d'aquesta secció
        },
        dataType: "json",
        error: function(enquesta) {
            console.log("Error!");
        }
    });
}

function messageContainer(missatge) {
  var idMissatge = "#message"+missatge;

  $(idMissatge).fadeIn("slow");
  setTimeout(function(){
    $(idMissatge).fadeOut("slow", function () {
      $(idMissatge).addClass("template");
    });
  }, 3000);
}

function enviarResposta(){
  var respostesR = new Array();
  $("#divPreguntesResp").find("input[type=text]").each(function(index) {
    
    if($(this).val() != "") {
      respostesR[index] = $(this).val();
    }
  });
  //console.log(respostesR);
}

var Events = {
   init: function() {
        //Event que s'executa quan entrem per primer cop a la web o premem les fletxes d'historial de navegació:
       window.onpopstate = function(event) {
           //Carreguem la secció que pertoqui després d'un canvi d'url
           carregaSeccio();
       };

       initLogin();

        /*** HOME ***/
        $("#bCrearEnquesta").click(function(e) {
            e.preventDefault();
            carregaSeccio("CrearEnquesta");
        });
        
        /*
        $("#bGetEnquesta").click(function(e){
            e.preventDefault();
            carregaSeccio("ObtindreEnquesta");
        });
        */

        /*** MENU ***/
        $("#mInici").click(function(e){
            e.preventDefault();
            carregaSeccio("Inici");
            $("#navigation li").removeClass("current");
            $("#lInici").addClass("current");
        });
        $("#mllistatEnq").click(function(e){
            e.preventDefault();
            carregaSeccio("LlistatEnquestes");
            $("#navigation li").removeClass("current");
            $("#lLlista").addClass("current");
        });
        $("#mCrearEnq").click(function(e) {
            e.preventDefault();
            carregaSeccio("CrearEnquesta");
            $("#navigation li").removeClass("current");
            $("#lNova").addClass("current");
        });
        $("#mRegistre").click(function(e){
            e.preventDefault();
            carregaSeccio("Registre");
            $("#navigation li").removeClass("current");
            $("#lRegistre").addClass("current");
        });
        $("#mContacta").click(function(e) {
            e.preventDefault();
            carregaSeccio("Contacte");
            $("#navigation li").removeClass("current");
            $("#lContacte").addClass("current");
        });


        /*** CREAR ENQUESTA ***/
        initDatePicker();
        $("#crearEnquesta .tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
        });

        $("#formCrearEnquesta").submit(function(e) {
            e.preventDefault(); //D'aquesta manera no fem refresh de la pantalla            

            //Necessari per fer validacio de formulari
            var isValidate=$("#formCrearEnquesta").valid();
        
            if(isValidate) {
               var enquesta = {
                   titol: $("#titol").val(),
                   inici: $("#dataInici").val(),
                   fi: $("#dataFi").val(),
                   estat: 0
               };

               $.ajax({
                   type: "POST",
                   url: "/api/enquesta",
                   contentType: "application/json",
                   data: JSON.stringify(enquesta),
                   success: function(data) {
                      enquesta.id = data.id; 

                      $.alert("Per a accedir a la teva pàgina d'administració, copia el següent enllaç i no el perdis, dons és la unica manera d'accedir a l'administració de l'enquesta.<br><br><p align='center'><b>"+domini+"Enquestes/Enq"+enquesta.id+"/</b></p>", {
                        title:'Enquesta creada amb èxit.',
                        icon:'',
                        buttons:[
                            {
                              title:'Tanca',
                              callback:function() { $(this).dialog("close");}
                          }
                        ]
                      });

                      carregaSeccio("Enquestes",enquesta);
                      configuraEstat(0,0,0);

                   },
                   error: function(data) {
                      $.alert("No s'ha pogut crear l'enquesta.");
                   }
               });
             }
          });

        /*** GET ENQUESTA ***/
        $("#getEnquesta .tornar").click(function(e) {
          e.preventDefault();
          carregaSeccio("Inici");
        });

        $("#formGetEnquesta").submit(function(e) {
            e.preventDefault();
            var enquesta = {
               id: $("#formGetEnquesta input#id").val(),
            }

            $.ajax({
              type: "GET",
              url: "/api/enquestes/admin0/enq"+enquesta.id,
              success: function(enquesta) {
                 carregaSeccio("Enquestes",enquesta);
              },
              dataType: "json",
              error: function(enquesta) {
                 alert("No s'ha pogut obtindre l'enquesta");
              }
            });
        });

        /*** VEURE ENQUESTA ***/
        $("#veureEnquesta .tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
        });

        $("#veureEnquesta .publicar").click(function(e) {
            e.preventDefault();

            /** comprovem si la enquesta no té preguntes per impedir que es publiqui buida! **/
            if($("#divPreguntes > div").length === 0){
                messageContainer("Fail");
                return;
            }

            enquestaId = location.pathname.substring(1).split("/")[1].substring(3);
            var estatEnquesta = {
              ident: 1
            }
            $.ajax({
              type: "PATCH",
              url: "/api/enquestes/admin0/enq"+enquestaId,
              contentType: "application/json",
              data: JSON.stringify(estatEnquesta),
              success: function(data) {
                messageContainer("Success");
                configuraEstat(1, data.idResp, 0);
                //console.log(data)
                //window.location = "http://localhost:8080/";
                //history.pushState({page:"Inici"}, "Inici", domini+"Inici/");
                /*$.alert("A partir d'aquest moment, per a respondre a l'enquesta es pot accedir per el link que apareix a sota de les dades de l'enquesta.<br><br>Pots tornar a modificar les dades de l'enqueste sempre que ningú l'hagi contestat, però es perdrà l'enllaç per a respondre.", {
                  title:'Enquesta publicada amb èxit.',
                  icon:'',
                  buttons:[
                    {
                      title:'Tanca',
                      callback:function() { 
                        $(this).dialog("close");
                        configuraEstat(1, data.idResp);
                        //window.location = window.location;
                      }
                    }
                  ]
                });*/
              },
              error: function(data) {
                messageContainer("Fail");
                configuraEstat(0, 0,0);
              }
            });
        });

        $("#veureEnquesta .veureR").click(function(e) {
          e.preventDefault();
          carregaSeccio("veureRespostes");
          /*if($("#veureEnquesta .veureR").val() == "Veure Respostes"){
            $("#veureRespostes").removeClass("template");
            $("#veureEnquesta .veureR").val("Amagar Respostes");
          }
          else{
            $("#veureRespostesUser").addClass("template");
            $("#veureRespostes").addClass("template");
            $("#veureEnquesta .veureR").val("Veure Respostes");
          }*/
          
        });

        $("#formVeureEnquesta").submit(function(e) {
            e.preventDefault();

            var isValidate=$("#formVeureEnquesta").valid();

            if(isValidate) {
              //var enquestaId = getUrlVars()["id"];
              enquestaId = location.pathname.substring(1).split("/")[1].substring(3);
              
              var enquesta = {
                titol: $("#veureTitol").val(),
                inici: $("#veureDesM").val(),
                fi: $("#veureFinsM").val()
              }
              //console.log(enquesta);

              $.ajax({
                type: "PUT",
                url: "/api/enquestes/admin0/enq"+enquestaId,
                contentType: "application/json",
                data: JSON.stringify(enquesta),
                success: function(data) {
                  messageContainer("Success");
                  configuraEstat(0, 0, 0);
                },
                error: function(data) {
                  messageContainer("Fail");
                }
              });
            }
        });

        $("#bAfegirPreguntes").click(function() {
          $("#afegirPreguntes").removeClass("template");
        });

        $("#rbTipusText").click(function() {
          $("#preguntaTest").addClass("template");
          $("#divAfegirNovaResposta").empty();
          $("#respostaPregunta1").val("");
        });

        $("#rbTipusTest").click(function() {
          $("#preguntaTest").removeClass("template");
        });

        $("#rbTipusMulti").click(function() {
          $("#preguntaTest").removeClass("template");
        });        

        $("#bAfegirResposta").click(function() {
          //Cada cop que afegim una pregunta incrementem el seu identificador
          var numRespostes = $('#numResposta').val();
          $("#preguntaTest").find("input[type=text]").each(function() {
            numRespostes++;
          });
          $('#numResposta').val(numRespostes);
          var novaResposta = "<div class='inputdata'><label for='respostaPregunta" + numRespostes + "'>Resposta</label>";
          novaResposta += "<span><input type=\"text\" id=\"respostaPregunta"+ numRespostes +"\" class=\"required\" name=\"respostaPregunta"+ numRespostes +"\" /></span>";
          novaResposta += "<img src='/img/delete.png' id='eliminaResposta" + numRespostes + "' class='deleteResposta' alt='Elimina resposta' title='Elimina Resposta' /></div>";
          
          $("#divAfegirNovaResposta").append(novaResposta);

          Events.botonsDeleteRespostes(numRespostes);
          
          //$("#preguntaTest").append("<input type=\"text\" name=\"respostaPregunta\" id=\"respostaPregunta\"/> <br>");
          //$("#preguntaTest").append($("#preguntaTest input#bAfegirResposta"));

        });
       
        $("#formAfegirPreguntes").submit(function(){
            event.preventDefault();

            var isValidate=$("#formAfegirPreguntes").valid();

            if(isValidate) {
              //var enquestaId = getUrlVars()["id"];
              enquestaId = location.pathname.substring(1).split("/")[1].substring(3);

              var respostesP = new Array();
              $("#divAfegirResposta input[type=text]").each(function(index){
                if($(this).val() != "") {
                  respostesP[index] = $(this).val();
                }
              });

              if(respostesP[0] == "") respostesP = null;

              var pregunta = {
                  tipus: $('#formAfegirPreguntes input[name=tipusPregunta]:checked').val(),
                  enunciat: $("#formAfegirPreguntes input#titolPregunta").val(),
                  respostes: respostesP
              }

              //console.log(enquestaId);
              //console.log(pregunta);

              $.ajax({
                  type: "POST",
                  url: "/api/enquestes/admin0/enq"+enquestaId,
                  contentType: "application/json",
                  data: JSON.stringify(pregunta),
                  success: function(enquesta){
                      messageContainer("Success");
                      $("#afegirPreguntes input[type=text]").each(function() {$(this).val("")});
                      //$("#rbTipusText").attr('checked', 'checked');
                      //$("#preguntaTest").addClass("template");
                      $("#divAfegirNovaResposta").empty();
                      $('#numResposta').val('1');
                      configuraEstat(0, 0, 0);
                      pintaPreguntes(enquesta);
                      $("html, body").animate({ scrollTop: $(document).height() }, "slow");
                      //window.location = domini+"Enquestes/Enq"+enquestaId+"/";
                      //history.pushState({page:"Enquesta"}, "Enquesta", domini+"Enquesta/"+enquestaId+"/");
                  },
                  error: function(){
                      messageContainer("Fail");
                  }
              });
            }
        });

        /** RESPONDRE ENQUESTA **/
        $("#formRespEnq").submit(function(event){
            event.preventDefault();
            var isValidate=$("#formRespEnq").valid();

            if(isValidate) {
              enquestaId = location.pathname.substring(1).split("/")[1].substring(3);

              var idUser = "0";
              if(location.pathname.split("/")[3] != null) {
                idUser = location.pathname.substring(1).split("/")[2].substring(4);                  
              }

              var respostes = new Array();
              var posicioResposta = 0;
              $(event.target).find(".divContingutPregunta :input").each(function(index) {
                
                if($(this).is(":radio") || $(this).is(":checkbox")) {
                  if($(this).is(":checked")) {
                    respostes[posicioResposta] = [$(this).closest('.inputdata').attr('id'), $(this).val()];
                    posicioResposta++;
                  }
                }
                else {
                  respostes[posicioResposta] = [$(this).attr('id'), $(this).val()];
                  posicioResposta++;
                }                
              });

              var resposta = {
                respostes: respostes
              }


              $(event.target).closest(".divFormulariResp").find(".divContingutPregunta :input").each(function(index) {
                
              if($(this).is(":radio") || $(this).is(":checkbox")) {
                  if($(this).is(":checked")) {
                    respostes[posicioResposta] = [$(this).closest('.inputdata').attr('id'), $(this).val()];
                    posicioResposta++;
                  }
                }
                else {
                  respostes[posicioResposta] = [$(this).attr('id'), $(this).val()];
                  posicioResposta++;
                }                
              });

              if(idUser == "0"){
                $.ajax({
                  type: "POST",
                  url: "/api/enquestes/user"+idUser+"/enq"+enquestaId,
                  contentType: "application/json",
                  data: JSON.stringify(resposta),
                  success: function(enquestaUser){
                      messageContainer("Success");
                      $("#respondEnq").empty();
                      resultat="<div class='missatgeCentral'>";
                      resultat+="<p>Les respostes s'han enviat correctament. Pot consultar o modificar la seva enquesta accedint al següent enllaç.</p>";
                      resultat+="<a href='"+domini+"Respondre/Enq"+enquestaId+"/User"+enquestaUser.idUser+"'>"+domini+"Respondre/Enq"+enquestaId+"/User"+enquestaUser.idUser+"</a>";
                      resultat+="</div>";
                      $("#respondEnq").append(resultat);
                  },
                  error: function(){
                      messageContainer("Fail");
                      $("#respondEnq").empty();
                      resultat="<div class='missatgeCentral'>";
                      resultat+="<p>S'ha produït un error al enviar les respostes. Torni a provar-ho de nou, disculpi les molèsties.</p>";
                      resultat+="<a href='"+domini+"Respondre/Enq"+enquestaId+"'>"+domini+"Respondre/Enq"+enquestaId+"</a>";
                      resultat+="</div>";
                      $("#respondEnq").append(resultat);
                  }
                });
              }
              else{
                $.ajax({
                  type: "PUT",
                  url: "/api/enquestes/user"+idUser+"/enq"+enquestaId,
                  contentType: "application/json",
                  data: JSON.stringify(resposta),
                  success: function(enquestaUser){
                      messageContainer("Success");
                      $("#respondEnq").empty();
                      resultat="<div class='missatgeCentral'>";
                      resultat+="<p>Les respostes s'han enviat correctament. Pot consultar o modificar la seva enquesta accedint al següent enllaç.</p>";
                      resultat+="<a href='"+domini+"Respondre/Enq"+enquestaId+"/User"+enquestaUser.idUser+"'>"+domini+"Respondre/Enq"+enquestaId+"/User"+enquestaUser.idUser+"</a>";
                      resultat+="</div>";
                      $("#respondEnq").append(resultat);
                  },
                  error: function(){
                      messageContainer("Fail");
                      $("#respondEnq").empty();
                      resultat="<div class='missatgeCentral'>";
                      resultat+="<p>S'ha produït un error al enviar les respostes. Torni a provar-ho de nou, disculpi les molèsties.</p>";
                      resultat+="<a href='"+domini+"Respondre/Enq"+enquestaId+"'>"+domini+"Respondre/Enq"+enquestaId+"</a>";
                      resultat+="</div>";
                      $("#respondEnq").append(resultat);
                  }
                });
              } 
            }
        });

        /** REGISTRAR USUARIS **/
        $("#registre .tornar").click(function(e) {
            e.preventDefault();
            carregaSeccio("Inici");
            $("#navigation li").removeClass("current");
            $("#lInici").addClass("current");
        });
        $("#formReg").submit( function (event){
            event.preventDefault();
            if (checkpass()) {
                user = $("#emailReg").val(),
                pass = $("#passReg1").val()
                //console.log("pass correct")
                $.ajax({
                  type: "GET",
                  url: "/api/registre?user="+user+"&pass="+pass,
                  contentType: "application/json",
                  success: function(data){
                      messageContainer("Success");
                      $("#formRegistre").empty();
                      $("#subRegistre").addClass('template')
                      resultat="<div><p>El usuari ha estat registrat correctament. Ja pots iniciar sessió amb el username y el password.</p></div>";
                      $("#formRegistre").append(resultat);
                  },
                  error: function(data){
                      messageContainer("Fail");
                      $("#formRegistre").empty();
                      resultat="<div><p>Ha succeït un error en el proces de registre. Torna a realitzar el registre.</p></div>";
                      $("#subRegistre").addClass('template')
                      $("#formRegistre").append(resultat);
                  }
                });
                return true;
            }
            else {
                console.log("error no pass correct");
                return false;
            }
        });

    $("#contactar .tornar").click(function(e) {
          e.preventDefault();
          carregaSeccio("Inici");
    });
  },

   botonsPreguntes: function(){
        var idEnq = location.pathname.substring(1).split("/")[1].substring(3);
        var botonsDelete = $("#divPreguntes input[name=deletePreg]");
        var botonsMod = $("#divPreguntes input[name=modPreg]");

        $.each(botonsDelete, function(num,boto) {
            $(boto).click(function(event){
              deletePregunta(idEnq,boto.id);
            });
        });
        $.each(botonsMod, function(num,boto) {
          $(boto).click(function(event){
            modPregunta(idEnq,boto.id);
          });
        });
   },
   botonsVeureRespostes: function(){
        var idEnq = location.pathname.substring(1).split("/")[1].substring(3);
        var botonsVeure = $("#veureRespostes input");
        $.each(botonsVeure, function(num,boto) {
            $(boto).click(function(event){
                //alert(boto.id);
                var idRe = boto.id.substring(14);
                veureRespostes(idEnq,idRe);
            });
        });
   },
   botonsDeleteRespostes: function(num){
        $("#eliminaResposta" + num).click(function(event){
            $(event.target).closest('.inputdata').remove();
        });
   },

   botoEnviarResposta: function(){
        var idEnq = location.pathname.substring(1).split("/")[1].substring(3);
        $("#enviarResp").click(function(event){
            enviarResposta();
        });
   },
   botoFinalitzarResposta: function(){
        $("#finResp").click(function(event){
            event.preventDefault();
            var isValidate=$("#formRespEnq").valid();

            if(isValidate) {
              enquestaId = location.pathname.substring(1).split("/")[1].substring(3);

              var idUser = "0";
              if(location.pathname.split("/")[3] != null) {
                idUser = location.pathname.substring(1).split("/")[2].substring(4);                  
              }

              var respostes = new Array();
              var posicioResposta = 0;
              $(event.target).closest(".divFormulariResp").find(".divContingutPregunta :input").each(function(index) {
                
              if($(this).is(":radio") || $(this).is(":checkbox")) {
                  if($(this).is(":checked")) {
                    respostes[posicioResposta] = [$(this).closest('.inputdata').attr('id'), $(this).val()];
                    posicioResposta++;
                  }
                }
                else {
                  respostes[posicioResposta] = [$(this).attr('id'), $(this).val()];
                  posicioResposta++;
                }                
              });

              var resposta = {
                respostes: respostes
              }

              if(idUser == "0"){
                $.ajax({
                  type: "POST",
                  url: "/api/enquestes/user"+idUser+"/enq"+enquestaId+"/finish",
                  contentType: "application/json",
                  data: JSON.stringify(resposta),
                  success: function(enquestaUser){
                      messageContainer("Success");
                      $("#respondEnq").empty();
                      resultat="<div class='missatgeCentral'>";
                      resultat+="<p>Les respostes s'han enviat correctament.</p>";
                      resultat+="</div>";
                      $("#respondEnq").append(resultat);
                  },
                  error: function(){
                      messageContainer("Fail");
                      $("#respondEnq").empty();
                      resultat="<div class='missatgeCentral'>";
                      resultat+="<p>S'ha produït un error al enviar les respostes. Torni a provar-ho de nou, disculpi les molèsties.</p>";
                      resultat+="<a href='"+domini+"Respondre/Enq"+enquestaId+"'>"+domini+"Respondre/Enq"+enquestaId+"</a>";
                      resultat+="</div>";
                      $("#respondEnq").append(resultat);
                  }
                });
              }
              else{
                $.ajax({
                  type: "PUT",
                  url: "/api/enquestes/user"+idUser+"/enq"+enquestaId+"/finish",
                  contentType: "application/json",
                  data: JSON.stringify(resposta),
                  success: function(enquestaUser){
                      messageContainer("Success");
                      $("#respondEnq").empty();
                      resultat="<div class='missatgeCentral'>";
                      resultat+="<p>Les respostes s'han enviat correctament.</p>";
                      resultat+="</div>";
                      $("#respondEnq").append(resultat);
                  },
                  error: function(){
                      messageContainer("Fail");
                      $("#respondEnq").empty();
                      resultat="<div class='missatgeCentral'>";
                      resultat+="<p>S'ha produït un error al enviar les respostes. Torni a provar-ho de nou, disculpi les molèsties.</p>";
                      resultat+="<a href='"+domini+"Respondre/Enq"+enquestaId+"'>"+domini+"Respondre/Enq"+enquestaId+"</a>";
                      resultat+="</div>";
                      $("#respondEnq").append(resultat);
                  }
                });
              } 
            }
        });
   },
   initModificaPregunta: function() {
      $("#rbTipusTextModifica").click(function() {
          $("#preguntaTestModifica").addClass("template");
          $("#divAfegirRespostaBotoModifica").addClass("template");
          $("#divAfegirNovaRespostaModifica").addClass("template");
          $("#respostaPreguntaModifica1").val("");
        });

        $("#rbTipusTestModifica").click(function() {
          $("#preguntaTestModifica").removeClass("template");
          $("#divAfegirRespostaBotoModifica").removeClass("template");
          $("#divAfegirNovaRespostaModifica").removeClass("template");
        });

        $("#rbTipusMultiModifica").click(function() {
          $("#preguntaTestModifica").removeClass("template");
          $("#divAfegirRespostaBotoModifica").removeClass("template");
          $("#divAfegirNovaRespostaModifica").removeClass("template");
        });        

        $("#bAfegirRespostaModifica").click(function() {
          //Cada cop que afegim una pregunta incrementem el seu identificador
          var numRespostes = $('#numRespostaModifica').val();
          $("#preguntaTestModifica").find("input[type=text]").each(function() {
            numRespostes++;
          });
          $('#numRespostaModifica').val(numRespostes);
          var novaResposta = "<div class='inputdata'><label for='respostaPreguntaModifica" + numRespostes + "'>Resposta</label>";
          novaResposta += "<span><input type=\"text\" id=\"respostaPreguntaModifica"+ numRespostes +"\" class=\"required\" name=\"respostaPregunta"+ numRespostes +"\" /></span>";
          novaResposta += "<img src='/img/delete.png' id='eliminaRespostaModifica" + numRespostes + "' class='deleteResposta' alt='Elimina resposta' title='Elimina Resposta' /></div>";
          
          $("#divAfegirNovaRespostaModifica").append(novaResposta);

          Events.botonsDeleteRespostesModifica(numRespostes);

        });
   },
   botonsDeleteRespostesModifica: function(num){
        $("#eliminaRespostaModifica" + num).click(function(event){
            $(event.target).closest('.inputdata').remove();
        });
   },
   allBotonsDeleteRespostesModifica: function(){
      var num = 1;
      $(".deleteRespostaModifica").each(function(index) {

        $(this).click(function(event){
            $(event.target).closest('.inputdata').remove();
        });
      });
   }
};

var pintaPreguntes = function(data){
  $("#divPreguntes").empty();  

  if(data.preguntes){
      $.each(data.preguntes, function(num,pregunta) {
          $("#divPreguntes").append(function(index,html){
              var result = "<div class='divFilaPregunta' data-ajax-id='"+pregunta.id+"' data-ajax-tipus='"+pregunta.tipus+"'>";
                result += "<div class='divTitolFilaPregunta'>";
                  result += "<p id='pPregunta"+pregunta.id+"' >Pregunta "+(num+1)+"</p>";
                  result += "<p class='template'>"+pregunta.id+"</p>";
                  result += "<p>Tipus: "+pregunta.tipus+"</p>";
                result += "</div>";
                if(data.estat < 2){
                  result += "<div class='divBotoPregunta'>";
                  result += "<input type='button' id='"+pregunta.id+"' name='modPreg' value='Modificar Pregunta'/>";
                  result += "<input type='button' id='"+pregunta.id+"' name='deletePreg' value='Elimina Pregunta'/>";
                  result += "</div>";
                }
                result += "<div class='divContingutPregunta'>";
                  result += "<p>"+pregunta.text+"</p>";
                  result += "<input type='text' id='contingutPregunta"+pregunta.id+"' class='template' value='"+pregunta.text+"'/>";
              if(pregunta.possiblesRespostes.length > 0) {
                  result += "<div class='divFilaPossiblesRespostes'><br><p><b>Respostes</b></p>";
                  $.each(pregunta.possiblesRespostes, function(indexResposta,resposta) {
                      result += "<br><p>"+(indexResposta+1)+".- "+resposta+"</p>";
                      result += "<input type='text' id='contingutResposta"+pregunta.id+"_"+indexResposta+"' class='template' value='"+resposta+"'/>";
                  });
                  result += "</div>";
                }
                result += "</div>";
              result += "</div>";
              return result;
          });
      });

      $(".divFilaPregunta:even").addClass("filaEven"); 
      $(".divFilaPregunta:odd").addClass("filaOdd");      

      //$("#divPreguntes").append("<div id='divOrdenaPreguntesBoto' class='boto'><input type='button' id='bOrdenaPreguntes' name='bOrdenaPreguntes' value='Confirma Ordre'></div>");      

      Events.botonsPreguntes();

  }
}

//Funció per a pintar l'estat de l'enquesta, cal cridar-la cada vegada que es faci una crida al server si no fem refresh.
var configuraEstat = function(estat, id, resp){
  $("#estatEnquesta").html("<h2 id ='estatEnq'>Estat de l'enquesta</h2>");
  if(estat == 0){    
    $("#estatEnquesta").append("<h4>En construcció</h4>");
    $("#estatEnquesta").append("<p>L'enquesta està en estat de construcció. Pot ser modificada, i es poden afegir i treure preguntes. Per a finalitzar-la prèmer el botó de Publicar.</p>");
    $("#veureEnquesta .publicar").removeClass("template");
    $("#veureEnquesta .veureR").addClass("template");

    //Mentre l'enquesta no estigui publicada podem canviar l'ordre
    $("#divPreguntes").addClass("sortable");
    initSortable();

  }
  else if(estat == 1){

    $("#estatEnquesta").append("<h4>Publicada</h4>");
    $("#estatEnquesta").append("<p>L'enquesta pot ser resposta per qualsevol persona que accedeixi a l'enllaç que apareix a continuació.</p>");
    $("#estatEnquesta").append("<p>Si es modifica cap de les dades de l'enquesta, aquesta tornarà a l'estat de construcció, i l'enllaç quedarà invalidat</p>");
    $("#estatEnquesta").append("<h6>"+domini+"Respondre/Enq"+id+"</h6>");
    $("#veureEnquesta .publicar").addClass("template");
    $("#veureEnquesta .veureR").addClass("template");

    //Si tenim l'enquesta publicada ja no podem canviar l'ordre
    if($("#divPreguntes").hasClass("sortable")) {
      resetSortable("#divPreguntes");
    }
  } 
  else if(estat == 2){
    $("#estatEnquesta").append("<h4>Resposta</h4>");
    $("#estatEnquesta").append("<p>L'enquesta ha estat resposta per alguna persona. Ja no pot tornar a ser modificada.</p>");
    $("#estatEnquesta").append("<p>L'enquesta pot ser resposta per qualsevol persona que accedeixi a l'enllaç que apareix a continuació.</p>");
    $("#estatEnquesta").append("<h6>"+domini+"Respondre/Enq"+id+"</h6>");
    $("#estatEnquesta").append("<h6>Respostes a l'enquesta: "+resp+"</h6>");
    $("#veureEnquesta .publicar").addClass("template");
    $("#veureEnquesta .veureR").removeClass("template");
    
    //Si tenim l'enquesta publicada ja no podem canviar l'ordre
    if($("#divPreguntes").hasClass("sortable")) {
      resetSortable("#divPreguntes");
    }
  } 
}

var posaEnquestats = function(data){

  $("#veureRespostes").empty();
  $("#veureRespostes").append("<h2>Persones que han respost l'enquesta</h2>");
  if(data.finalitzades.length == 0){
    $("#veureRespostes").append("<h4>Encara cap usuari ha respost completament l'enquesta</h4>");
  }
    $.each(data.finalitzades, function(num,resposta) {
      $("#veureRespostes").append(function(index,html){
        var result = "<div class='divFilaPregunta'>";
        result += "<div class='divTitolFilaPregunta'>";
        result += "<p>Enquestat "+(num+1)+"</p>";
        result += "<p class='template'>"+resposta+"</p>";
        result += "</div>";
        result += "<div class='divBotoEnquestat'>";
        result += "<input type='button' id='veureEnquestat"+resposta+"' name='veureEnquestat"+(num+1)+"' value='Veure'/>";
        result += "</div>";
        result += "<div class='divContingutPregunta'>";
        result += "<p>Anònim</p>";
        result += "</div>";
        result += "</div>";
        result += "<div class='separadorBlanc'></div></div>";
        return result;
      });
    });
    Events.botonsVeureRespostes();
}

var posaRespostesUser = function(data){

  $("#veureRespostesUser").empty();
  $("#veureRespostesUser").removeClass("template");
  $("#veureRespostesUser").append("<h2>Respostes de l'usuari</h2>");
    $.each(data.respostes, function(num,resposta) {
      $("#veureRespostesUser").append(function(index,html){
        var result = "<div class='divFilaPregunta'>";
        result += "<div class='divTitolFilaPregunta'>";
        result += "<p>Pregunta "+(num+1)+" : </p>";
        result += "<p>"+resposta.pregunta+"</p>";
        if(resposta.possiblitats){
          $.each(resposta.possiblitats,function(num,possib){
            result += "<p> · "+possib+"</p>";
          });
        }
        result += "<div class='divContingutPregunta'>";
        result += "<p>Resposta: "+resposta.respostes+"</p>";
        result += "</div>";
        result += "</div>";
        result += "<div class='separadorBlanc'></div></div>";
        return result;
      });
    });
}

//Funció de configuració dels diversos elements de la web segons la secció en que ens trobem
var configuraSeccio = function(data){
    //Si el formulari te validacions les fara automaticament
    validaSeccio();

    var path = location.pathname.substring(1).split("/")[0];
    switch (path){
        case "Enquestes":
            if(location.pathname.substring(1).split("/")[2] == "veureRespostes") break;
            // if(data == null) --> ERROR...
            $("#veureTitol").val(data["titol"]);
            $("#veureDesM").val(data["inici"]);
            $("#veureFinsM").val(data["fi"]);
            var r = 0;
            if(data.estat > 1) r = data.finalitzades.length;
            configuraEstat(data.estat, data.idResp, r);
            pintaPreguntes(data);
            $("#veureRespostesUser").addClass("template");
            $("#veureRespostes").addClass("template");
            if(data.estat < 2){
              $("#afegirPreguntes").removeClass("template");
              $("#veureEnquesta .modifica").removeClass("template");
            }
            else{
              $("#afegirPreguntes").addClass("template");
              $("#veureEnquesta .modifica").addClass("template");
              posaEnquestats(data);
            }
            break;
        case "Respondre":
            console.log(data);
            var dActual = new Date();

            var dia = parseInt(data.inici.substr(0,2));
            var mes = parseInt(data.inici.substr(3,2));
            mes--;
            var any = parseInt(data.inici.substr(6,4));
            var dIniciEnquesta = new Date(any, mes, dia);

            $("#veureTitolResp").text(data["titol"]);
            $("#veureDesMResp").text(data["inici"]);
            $("#veureFinsMResp").text(data["fi"]);
            
            if(data.estat >= 1 && dActual.getTime() >= dIniciEnquesta.getTime()) {             

              var idUser = "0";
              var finalitzada=false;

              if(location.pathname.split("/")[3] != null) {
                idUser = location.pathname.substring(1).split("/")[2].substring(4);
                $(data.finalitzades).each(function() {
                  if(this == idUser) {
                    finalitzada = true;
                  }
                });                  
              }
              //console.log(idUser)
              if(finalitzada == false) {
                if(data.preguntes){
                    $.each(data.preguntes, function(num,pregunta) {
                        $("#divPreguntesResp").append(function(index,html){
                              //console.log(pregunta);
                              var result = "<div class='divFilaPregunta'>";
                              result += "<div class='divTitolFilaPregunta'>";
                                result += "<p>"+(num+1)+". "+pregunta.text+"</p>";
                                result += "<p class='template'>Tipus: "+pregunta.tipus+"</p>";
                              result += "</div>";
                              result += "<div class='divContingutPregunta'>";
                                result += "<p class='template'>Pregunta: "+pregunta.text+"</p>";
                            switch (pregunta.tipus){
                                case "Text":
                                      //console.log(pregunta.respostes)
                                      var respostaUsuari = "";
                                      $.each(pregunta.respostes, function(numR,r) {
                                        if(r.idEnquestat == idUser) {
                                          respostaUsuari = r.resposta;
                                        }
                                      });
                                      //result += "<span><input type='text' name='respostaPregunta' id='"+pregunta.id+"' class='respostaPregunta required'></span>";
                                      result += "<span><textarea name='respostaPregunta' id='"+pregunta.id+"' class='respostaPregunta required'>"+respostaUsuari+"</textarea></span>";
                                      result += "</div>";
                                    result += "</div>";
                                    break;
                                case "Test":
                                    if(pregunta.possiblesRespostes.length > 0) {

                                      var respostaUsuariTest = "";
                                      $.each(pregunta.respostes, function(numR,r) {
                                        if(r.idEnquestat == idUser) {
                                          respostaUsuariTest = r.resposta;
                                        }
                                      });

                                      result += "<div class='inputdata' id='"+pregunta.id+"'>";
                                        $.each(pregunta.possiblesRespostes, function(indexResposta,resposta) {
                                            var marcada = "";
                                            if(resposta == respostaUsuariTest) {
                                              marcada = "checked='true'";
                                            }
                                            result += "<span><input name='"+pregunta.text+"' type='radio' value='"+resposta+"' id='test"+pregunta.id+indexResposta+"' "+marcada+" required>"+resposta+"</span>";
                                        });
                                      result += "<div class='separadorBlanc'></div></div>";
                                    }
                                    result += "</div>";
                                    result += "</div>";
                                    break;
                                case "Multi":
                                    if(pregunta.possiblesRespostes.length > 0) {

                                        var respostaUsuariMulti = new Array();
                                        var i=0;
                                        $.each(pregunta.respostes, function(numR,r) {
                                          if(r.idEnquestat == idUser) {
                                            respostaUsuariMulti[i] = r.resposta;
                                            i++;
                                          }
                                        });

                                        result += "<div class='inputdata' id='"+pregunta.id+"'>";
                                        $.each(pregunta.possiblesRespostes, function(indexResposta,resposta) {
                                          var marcada = "";
                                          for(var j=0; j<pregunta.possiblesRespostes.length; j++) {
                                            if(resposta == respostaUsuariMulti[j]) {
                                              marcada = "checked='true'";
                                            }
                                          }
                                          result += "<span><input type='checkbox' name='"+pregunta.text+indexResposta+"' id='multi"+pregunta.id+indexResposta+"' value='"+resposta+"' "+marcada+"/>"+resposta+"</span>"
                                          //result += "<span><input name='"+pregunta.text+indexResposta+"' type='checkbox' value='"+resposta+"' id='"+pregunta.id+"'>"+resposta+"</span>";                                    
                                        });
                                        result += "<div class='separadorBlanc'></div></div>";
                                    }
                                      result += "</div>";
                                    result += "</div>";
                                    break;
                            }
                            return result;
                        });
                      })
                       
                       $("#divPreguntesResp").append("<div class='boto'><input type='submit' id='enviarResp' name='enviarResp' value='Enviar Respostes'/><span>  Es podrà completar l'enquesta posteriorment</span></div>");
                       $("#divPreguntesResp").append("<div class='boto'><input type='button' class='finResp' id='finResp' name='finResp' value='Finalitzar Enquesta'/><span>  S'envien les respostes de manera definitiva</span></div>");
                       Events.botoFinalitzarResposta();
                    }
                  }
                  else {
                    $("#divPreguntesResp").html("<div class='missatgeCentral'><p>Ja has finalitzat l'enquesta, per tant no pots tornar a modificar-la.</p></div>")
                  }
                }
                else {
                  if(dActual.getTime() < dIniciEnquesta.getTime()) {
                    $("#divPreguntesResp").html("<div class='missatgeCentral'><p>L'enquesta comença el dia <b>"+data["inici"]+"</b> fins aleshores no podras respondre cap pregunta.</p></div>")
                  }
                  else {
                    $("#respondEnq").html("<div class='missatgeCentral'><p>Estàs intentant accedir a una enquesta no publicada.</p></div>")
                  }
                }
            break;
        case "LlistatEnquestes":
            $("#llistatEnq").html("");
            $.each(data.enquestes, function(numEnq,enquesta){
                //console.log(enquesta);
                result =  "<div class='enquesta'>";
                result += "<h2>"+enquesta.titol+"</h2>";
                if (enquesta.estat == 0) estat = "En construcció";
                else if (enquesta.estat == 1) estat = "Publicada";
                else if (enquesta.estat == 2) estat = "Resposta";
                result += "<b><p class='estat'>Estat de l'enquesta: </b>"+estat+"</p>";
                result += "<p><b>Data Inici:</b> "+enquesta.inici+"</p>";
                result += "<p><b>Data Fi:</b> "+enquesta.fi+"</p>";
                $.each(enquesta.preguntes, function(indexResposta,pregunta){
                    result += "<div class='preguntas'>";
                    result += "<h3>"+pregunta.text+"<p class='tipus'>Num de respostes: "+pregunta.respostes.length+"</p></h3>";
                    result += "<h3 onhover='$(#"+indexResposta+").removeClass('template')'>"+pregunta.text+"<p class='tipus'>Num de respostes: "+pregunta.respostes.length+"</p></h3>";
                    result += "<div id='"+indexResposta+"' class='template'>"
                    $.each(pregunta.respostes, function(indexResposta, resposta) {
                       result += "<p>"+resposta.resposta+"</p>";
                    });
                    result += "</div>"
                    if (pregunta.tipus == "Text"){
                        //result += "<textarea cols='90' rows='5'></textarea>"
                    } else if (pregunta.tipus == "Test") {
                        $.each(pregunta.possiblesRespostes, function(indexResposta,resposta){
                            //result += "<input type='radio'>"+resposta+"<br/>"
                        });
                    } else if (pregunta.tipus == "Multi") {
                        $.each(pregunta.possiblesRespostes, function(indexResposta,resposta){
                            //result += "<input type='checkbox'>"+resposta+"<br/>"
                        });
                    }
                    result += "</div>";
                });
                result += "</div><br/>";
                $("#llistatEnq").append(result);
            });
            break;
        default:
            ;
    }
};

//Funció d'inicialització de la WebApp
$( document ).ready( Events.init );

