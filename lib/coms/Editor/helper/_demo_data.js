let shortId = require('shortid');
let str = `Lorem ipsum dolor sit amet, habemus percipit eu sea, recteque maiestatis cum id. Ponderum patrioque intellegebat cum eu. Percipit luptatum mandamus cu per, erat semper recusabo id usu. Mel ei accusam evertitur, has vero delenit adipisci no. Eu sea illum utroque, vel nobis cetero albucius ea, solet albucius qualisque ea per.    Cu clita accusam concludaturque vim, eu sit laboramus suscipiantur.
Sea sale postulant ne, eam aeterno deserunt periculis ad. Eos cu dicat admodum, eu usu propriae percipitur. Nec autem invenire at, minim electram sed ut. Vidit nonumy tacimates at vim. Meis timeam perpetua eu qui.
Has verear suscipiantur ea, ea adhuc numquam reformidans nam. Ea vivendum recteque iracundia pro. Sed ei graece prompta, munere eloquentiam nam ex. Quod assueverit cotidieque est cu, id tollit hendrerit vulputate vim, mea et mutat euismod.
Eu magna laudem doctus ius. In fugit nemore accommodare vix, quem utinam eam in, decore antiopam quo ei. Id est suavitate voluptatibus, et saperet appareat praesent nam. Duo velit facilisi consetetur ex, vim iusto fuisset evertitur at, dicat oporteat ut mei.
Ius ex aeque albucius comprehensam, ea per ignota iisque splendide. Ex vim aliquam accumsan quaestio, no has erat albucius, his nullam essent ad. Cu sit fugit facer augue, cu per mundi aeterno epicuri. Cu sed quem justo consectetuer, elit menandri has at. Pro equidem platonem volutpat ei.`;


module.exports = str.split('\n').map(function(s){
	return {
		text: s,
		id: shortId.generate()
	};
});
