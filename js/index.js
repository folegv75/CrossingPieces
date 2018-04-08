window.onload = Init;
var xmlns = "http://www.w3.org/2000/svg";

class Point
{
	constructor(X,Y) 
	{
		this.X = X;
		this.Y = Y;
	}
}

class Line
{
	constructor(Id, HolstId, BeginPoint, EndPoint)
	{
		this.Id = Id;
		this.BeginPoint = BeginPoint;
		this.EndPoint = EndPoint;
		this.HolstId = HolstId;
		this.Color = 'black';
		this.Width = '1';
		
		let line = document.createElementNS(xmlns, 'line');
	line.setAttributeNS(null, 'x1', x1);
	line.setAttributeNS(null, 'y1', y1);
	line.setAttributeNS(null, 'x2', x2);
	line.setAttributeNS(null, 'y2', y2);
	//shape.setAttributeNS(null, 'stroke', 'rgba(255,255,0,0.2)');
	shape.setAttributeNS(null, 'stroke', 'rgba(255,255,0,0)');
	// 20 пикселей чтобы кликать по линии
	shape.setAttributeNS(null, 'stroke-width', '21');
	groupShape.appendChild(shape);

		
		let elem = document.getElementById(HolstId);
		
		
	}
	Create();
	Show();
}

class Main 
{
	constructor(HolstId) 
	{
		this.HolstId = HolstId;
	}
	
	Init();
}

function Init()
{
	
	let elem = document.getElementById('Holst');
	elem.addEventListener('click', HolstClick);
	elem.addEventListener('mousemove', HolstMove);

	elem = document.getElementById('calc-cross');
    elem.addEventListener('click', CalculateCrossing);
    
}

function HolstClick(E)
{
	// найдем ближайший конец линии
}

function HolstMove(E)
{
}

function CalculateCrossing(E)
{
}
