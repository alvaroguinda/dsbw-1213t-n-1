//Map de les seccions de la web cap als <DIV>s que les contenen:
var secc = {
    Inici : "inici",
    CrearEnquesta : "crearEnquesta",
    ObtindreEnquesta : "getEnquesta",
    Enquestes : "veureEnquesta",
    Registre : "registre",
    Contacte : "contactar",
    LlistatEnquestes : "llistatEnq",
    Respondre: "respondEnq"
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
                id = location.pathname.substring(1).split("/")[1].substring(3);
                if(id != "") getEnquestaURL(id);
                break;
            case "LlistatEnquestes":
                getLlistatEnquestes();
                break;
            case "Respondre":
                id = location.pathname.substring(1).split("/")[1].substring(3);
                if(id != "") getEnquestaRespondre(id);
                break;
            default: //si aquet path no existeix al nostre Map es que estem entrant per primer cop a la web i la url té el path en blanc o és "index.html"
                path = "Inici";
                configuraSeccio(data); //configurem els handlers d'aquesta secció
                history.pushState({page:path}, path, domini+path+"/"); //modifiquem la url de la web + l'historic associat del navegador
        }
        $("#"+secc[path]).removeClass("template"); //mostrem la secció segons el path
        validaSeccio();
    }
    else { //si hem rebut arguments es tracta d'un click a un botó que ha de conduir a una determinada secció
        if(data && data.id) id = "Enq"+data.id+"/"; //si rebem l'id d'una enquesta el concatenarem a la URL
        history.pushState({page:nomSeccio}, nomSeccio, domini+nomSeccio+"/"+id); //modifiquem la url de la web + l'historic associat del navegador
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
            configuraSeccio(enquesta); //configurem els handlers d'aquesta secció
        },
        dataType: "json",
        error: function(enquesta) {
            console.log("Error!");
        }
    });
}

// Retorna la enquetsa amb idResp id en format JSON:
function getEnquestaRespondre(id){
    $.ajax({
        type: "GET",
        url: "/api/enquestes/user0/enq"+id,
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
    $.ajax({
        type: "DELETE",
        url: "/api/enquestes/admin0/enq"+idEnq+"/preg"+idPreg,
        success: function(enquesta) {
            //location.reload();
            //console.log(enquesta);
            messageContainer("Success");
            configuraEstat(0, 0);
            pintaPreguntes(enquesta);
        },
        dataType: "json",
        error: function() {
            messageContainer("Fail");
            //console.log("Error!");
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
            $("#lInici").addClass("current");
            $("#lLlista").removeClass("current");
            $("#lNova").removeClass("current");
            $("#lRegistre").removeClass("current");
            $("#lContacte").removeClass("current");
        });
        $("#mllistatEnq").click(function(e){
            e.preventDefault();
            carregaSeccio("LlistatEnquestes");
            $("#lInici").removeClass("current");
            $("#lLlista").addClass("current");
            $("#lNova").removeClass("current");
            $("#lRegistre").removeClass("current");
            $("#lContacte").removeClass("current");
        });
        $("#mCrearEnq").click(function(e) {
            e.preventDefault();
            carregaSeccio("CrearEnquesta");
            $("#lInici").removeClass("current");
            $("#lLlista").removeClass("current");
            $("#lNova").addClass("current");
            $("#lRegistre").removeClass("current");
            $("#lContacte").removeClass("current");
        });
        $("#mRegistre").click(function(e){
            e.preventDefault();
            carregaSeccio("Registre");
            $("#lInici").removeClass("current");
            $("#lLlista").removeClass("current");
            $("#lNova").removeClass("current");
            $("#lRegistre").addClass("current");
            $("#lContacte").removeClass("current");
        });
        $("#mContacta").click(function(e) {
            e.preventDefault();
            carregaSeccio("Contacte");
            $("#lInici").removeClass("current");
            $("#lLlista").removeClass("current");
            $("#lNova").removeClass("current");
            $("#lRegistre").removeClass("current");
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
                   fi: $("#dataFi").val()
               };

               $.ajax({
                   type: "POST",
                   url: "/api/enquesta",
                   contentType: "application/json",
                   data: JSON.stringify(enquesta),
                   success: function(data) {
                       enquesta.id = data.id;
                       carregaSeccio("Enquestes",enquesta);

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
                //window.location = "http://localhost:8080/";
                //history.pushState({page:"Inici"}, "Inici", domini+"Inici/");
                $.alert("A partir d'aquest moment, per a respondre a l'enquesta es pot accedir per el link que apareix a sota de les dades de l'enquesta.<br><br>Pots tornar a modificar les dades de l'enqueste sempre que ningú l'hagi contestat, però es perdrà l'enllaç per a respondre.", {
                  title:'Enquesta publicada amb èxit.',
                  icon:'',
                  buttons:[
                    {
                      title:'Tanca',
                      callback:function() { 
                        $(this).dialog("close");
                        window.location = window.location;
                      }
                    }
                  ]
                });
              },
              error: function(data) {
                messageContainer("Fail");
              }
            });
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
              console.log(enquesta);

              $.ajax({
                type: "PUT",
                url: "/api/enquestes/admin0/enq"+enquestaId,
                contentType: "application/json",
                data: JSON.stringify(enquesta),
                success: function(data) {
                  messageContainer("Success");
                  configuraEstat(0, 0);
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
                      configuraEstat(0, 0);
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
   },
   botonsPreguntes: function(){
        var idEnq = location.pathname.substring(1).split("/")[1].substring(3);
        var botonsDelete = $("#divPreguntes input");
        $.each(botonsDelete, function(num,boto) {
            $(boto).click(function(event){
                //alert(boto.id);
                deletePregunta(idEnq,boto.id);
            });
        });
   },
   botonsDeleteRespostes: function(num){
        /*
        var idEnq = location.pathname.substring(1).split("/")[1].substring(3);
        var botonsDeleteRespostes = $("#divAfegirResposta img");
        $.each(botonsDeleteRespostes, function(num,boto) {
            $(boto).click(function(event){
                $(event.target).closest('.inputdata').remove();
            });
        });
        */
        $("#eliminaResposta" + num).click(function(event){
            $(event.target).closest('.inputdata').remove();
        });
   }
};

var pintaPreguntes = function(data){
  $("#divPreguntes").empty();
  if(data.preguntes){
      $.each(data.preguntes, function(num,pregunta) {
          $("#divPreguntes").append(function(index,html){
              console.log(pregunta);

              var result = "<div class='divFilaPregunta'>";
                result += "<div class='divTitolFilaPregunta'>";
                  result += "<p>Pregunta "+(num+1)+"</p>";
                  result += "<p class='template'>"+pregunta.id+"</p>";
                  result += "<p>Tipus: "+pregunta.tipus+"</p>";
                result += "</div>";
                result += "<div class='divBotoPregunta'>";
                  result += "<input type='button' id='"+pregunta.id+"' name='deletePreg"+(num+1)+"' value='Elimina Pregunta'/>";
                result += "</div>";
                result += "<div class='divContingutPregunta'>";
                  result += "<p>"+pregunta.text+"</p>";
              if(pregunta.possiblesRespostes.length > 0) {
                  result += "<br><p><b>Respostes</b></p>";
                  $.each(pregunta.possiblesRespostes, function(indexResposta,resposta) {
                      result += "<br><p>"+(indexResposta+1)+".- "+resposta+"</p>";
                  });
                }
                result += "</div>";
              result += "</div>";
              return result;
          });
      });

      $(".divFilaPregunta:even").addClass("filaEven"); 
      $(".divFilaPregunta:odd").addClass("filaOdd");

      Events.botonsPreguntes();
  }
}

//Funció per a pintar l'estat de l'enquesta, cal cridar-la cada vegada que es faci una crida al server si no fem refresh.
var configuraEstat = function(estat, id){
  $("#estatEnquesta").html("<h2 id ='estatEnq'>Estat de l'enquesta</h2>");
  if(estat == 0){
    $("#estatEnquesta").append("<h4 id ='estatEnq'>En construcció</h4>");
    $("#estatEnquesta").append("<h5 id ='estatEnq'>L'enquesta està en estat de construcció. Pot ser modificada, i es poden afegir i treure preguntes. Per a finalitzar-la prèmer el botó de Publicar.</h5>");
    $("#veureEnquesta .publicar").removeClass("template");
  }
  else if(estat == 1){
    $("#estatEnquesta").append("<h4 id ='estatEnq'>Publicada.</h4>");
    $("#estatEnquesta").append("<h5 id ='estatEnq'>L'enquesta pot ser resposta per qualsevol persona que accedeixi a l'enllaç que apareix a continuació.</h5>");
    $("#estatEnquesta").append("<h6 id ='estatEnq'>"+domini+"Respondre/Enq"+id+"</h6>");
    $("#veureEnquesta .publicar").addClass("template");
  }  
}

//Funció de configuració dels diversos elements de la web segons la secció en que ens trobem
var configuraSeccio = function(data){
    //Si el formulari te validacions les fara automaticament
    validaSeccio();

    var path = location.pathname.substring(1).split("/")[0];
    switch (path){
        case "Enquestes":
            // if(data == null) --> ERROR...
            $("#veureTitol").val(data["titol"]);
            $("#veureDesM").val(data["inici"]);
            $("#veureFinsM").val(data["fi"]);
            configuraEstat(data.estat, data.idResp);
            pintaPreguntes(data);
            break;
        case "Respondre":
            $("#veureTitolResp").text(data["titol"]);
            $("#veureDesMResp").text(data["inici"]);
            $("#veureFinsMResp").text(data["fi"]);
            if(data.preguntes){
                $.each(data.preguntes, function(num,pregunta) {
                    $("#divPreguntesResp").append(function(index,html){
                        console.log(pregunta);
                          var result = "<div class='divFilaPregunta'>";
                          result += "<div class='divTitolFilaPregunta'>";
                            result += "<p>Pregunta "+(num+1)+"</p>";
                            result += "<p>Tipus: "+pregunta.tipus+"</p>";
                          result += "</div>";
                          result += "<div class='divContingutPregunta'>";
                            result += "<p>Pregunta: "+pregunta.text+"</p>";
                        switch (pregunta.tipus){
                            case "Text":
                                    result += "<span><input type='text' name='respostaPregunta' id='"+pregunta.id+"' class='respostaPregunta required'></span>";
                                  result += "</div>";
                                result += "</div>";
                                break;
                            case "Test":
                                if(pregunta.possiblesRespostes.length > 0) {
                                    result += "<br><p><b>Respostes</b></p>";

                                      result += "<div class='inputdata'>";
                                    $.each(pregunta.possiblesRespostes, function(indexResposta,resposta) {
                                        result += "<span><input name='resposta"+num+"' type='radio'>"+resposta+"</span>";

                                    });
                                    result += "</div>";
                                }
                                  result += "</div>";
                                result += "</div>";
                                break;
                            case "Test":
                                if(pregunta.possiblesRespostes.length > 0) {
                                    result += "<br><p><b>Respostes</b></p>";

                                      result += "<div class='inputdata'>";
                                    $.each(pregunta.possiblesRespostes, function(indexResposta,resposta) {
                                        result += "<span><input  type='radio'>"+resposta+"</span>";

                                    });
                                    result += "</div>";
                                }
                                  result += "</div>";
                                result += "</div>";
                            break;
                        }
                        return result;
                    });
                  })
                }
            break;
        case "LlistatEnquestes":
            $("#llistatEnq").html("");
            $.each(data.enquestes, function(numEnq,enquesta){
                console.log(enquesta);
                result =  "<div class='enquesta'>";
                result += "<h2>"+enquesta.titol+"</h2>";
                result += "<p><b>Data Inici:</b> "+enquesta.inici+"</p>";
                result += "<p><b>Data Fi:</b> "+enquesta.fi+"</p>";
                $.each(enquesta.preguntes, function(indexResposta,pregunta){
                    result += "<div class='preguntas'>";
                    result += "<h3>"+pregunta.text+"</h3>";
                    if (pregunta.tipus == "Text"){
                        result += "<textarea cols='90' rows='5'></textarea>"
                    } else if (pregunta.tipus == "Test") {
                        $.each(pregunta.possiblesRespostes, function(indexResposta,resposta){
                            result += "<input type='radio'>"+resposta+"<br/>"
                        });
                    } else if (pregunta.tipus == "Multi") {
                        $.each(pregunta.possiblesRespostes, function(indexResposta,resposta){
                            result += "<input type='checkbox'>"+resposta+"<br/>"
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