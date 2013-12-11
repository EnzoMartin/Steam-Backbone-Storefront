/* Library of small useful global functions */
if (!window.Lib) { window.Lib = {}; }

(function(window,document,$,_,yepnope,undefined){
	Lib = function(){
		this.squads = [
			["SQUAD0","LONE WOLF"],
			["SQUAD1","ALPHA"],
			["SQUAD2","BRAVO"],
			["SQUAD3","CHARLIE"],
			["SQUAD4","DELTA"],
			["SQUAD5","ECHO"],
			["SQUAD6","FOXTROT"],
			["SQUAD7","GOLF"],
			["SQUAD8","HOTEL"],
			["SQUAD9","INDIA"],
			["SQUAD10","JULIET"],
			["SQUAD11","KILO"],
			["SQUAD12","LIMA"],
			["SQUAD13","MIKE"],
			["SQUAD14","NOVEMBER"],
			["SQUAD15","OSCAR"],
			["SQUAD16","PAPA"],
			["SQUAD17","QUEBEC"],
			["SQUAD18","ROMEO"],
			["SQUAD19","SIERRA"],
			["SQUAD20","TANGO"],
			["SQUAD21","UNIFORM"],
			["SQUAD22","VICTOR"],
			["SQUAD23","WHISKEY"],
			["SQUAD24","XRAY"],
			["SQUAD25","YANKEE"],
			["SQUAD26","ZULU"],
			["SQUAD27","HAGGARD"],
			["SQUAD28","SWEETWATER"],
			["SQUAD29","PRESTON"],
			["SQUAD30","REDFORD"],
			["SQUAD31","FAITH"],
			["SQUAD32","CELESTE"]
		];
	};

	Lib.prototype = {
		parse_chat_messages: function(msgs,squads){
			var result = '';
			if(typeof msgs == 'object'){
				if(msgs.length > 0){
					squads = squads || this.squads;
					var parsed_messages = [];
					_.each(msgs,function(message){
						message.MessageTimeStamp = moment(message.MessageTimeStamp).format('MM/DD/YYYY HH:mm:ss');
						message.Server = false;

						// Match on Squad
						var re1 = '.*?';	// Non-greedy match on filler
						var re2 = '(squad)';	// Word 1
						var re3 = '(\\d+)';	// Integer Number 1

						var p = new RegExp(re1 + re2 + re3,["i"]);
						var m = p.exec(message.MessageType);
						if(m != null){
							var squad_name = m[1].toUpperCase() + m[2];
							message.SquadName = _.find(squads,function(squad){
								return squad[0] == squad_name;
							});
							if(message.SquadName == undefined){
								message.SquadName = squad_name;
							} else {
								message.SquadName = message.SquadName[1];
							}
						}

						// Match on Team
						re1 = '(team)';	// Word 1
						re2 = '(\\d+)';	// Integer Number 1

						p = new RegExp(re1 + re2,["i"]);
						m = p.exec(message.MessageType);
						if(m != null){
							if(m[2] == "1"){
								message.MessageType = 'US';
							} else {
								message.MessageType = 'RU';
							}
							parsed_messages.push(message);
							return;
						}

						// Match on Server
						re1 = '(server)';	// Word 1
						p = new RegExp(re1,["i"]);
						m = p.exec(message.Speaker);
						if(m != null){
							message.MessageType = 'server';
							message.Server = true;
							parsed_messages.push(message);
							return;
						}

						// Match on All
						re1 = '(all)';	// Word 1

						p = new RegExp(re1,["i"]);
						m = p.exec(message.MessageType);
						if(m != null){
							parsed_messages.push(message);
						}
					});
					result = { 'status': 'success','content': parsed_messages };
				} else {
					result = { 'status': 'error','content': 'No messages found' };
				}
			} else {
				result = {'status': 'error','content': 'Needs to be an object'};
			}
			return result;
		},

		load: function(files,callback){
			var loading = this.get({view: {name: 'loading'}});
			loading.render();

			var files_loaded = this.files_loaded;
			var files_needed = _.difference(files,files_loaded);
			this.files_loaded = files_loaded.concat(files_needed);
			if(files_needed.length){
				var increment = 100 / files_needed.length;
				yepnope({
					load    : files_needed,
					callback: function(url,r,i){
						$('#progress-bar-inner').stop().animate({width: ((increment * (parseInt(i) + 1)) + '%')});
					},
					complete: function(){
						window.setTimeout(function(){
							if(callback){
								return callback();
							}
						},250);
					}
				});
			} else {
				if(callback){
					return callback();
				}
			}
		},

		alert: function(alert_data){
			var header = this.get({view: {name: 'header'}});
			header.trigger('alert',alert_data);
		},

		modal: function(data,callback){
			var footer = this.get({view: {name: 'footer'}});
			footer.trigger('modal',data,callback);
		},

		slugify: function(text){
			text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig,'');
			text = text.replace(/-/gi,"_");
			text = text.replace(/\s/gi,"-");
			return text;
		}
	};
}(window,document,jQuery,_,yepnope));