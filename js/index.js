window.onload = Init;
var xmlns = "http://www.w3.org/2000/svg";

var AppMain = null;

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
	constructor(Id)
	{
		this.sId = Id;
		this.SelfElem = document.createElementNS(xmlns, 'line');
		this.SelfElem.id = this.sId;

		this.sX1 = 0;
		this.sY1 = 0;
		this.sX2 = 0;
		this.sY2 = 0;
		this.sWidth = '2';
		this.sColor = 'black';
		//this.sDash = "0,0";
		this.Dash = "0,0";

		this.SelfElem.setAttributeNS(null, 'x1', this.sX1);
		this.SelfElem.setAttributeNS(null, 'y1', this.sY1);
		this.SelfElem.setAttributeNS(null, 'x2', this.sX2);
		this.SelfElem.setAttributeNS(null, 'y2', this.sY2);
		this.SelfElem.setAttributeNS(null, 'stroke', this.sColor);
		this.SelfElem.setAttributeNS(null, 'stroke-width', this.sWidth);
		//sSetAttributeNS('stroke-dasharray', this.sDash);
	}

	// priavate
	sSetAttributeNS(name, value) 
	{
		this.SelfElem.setAttributeNS(null, name, value);
	}

	get Id() { return this.sId };
	get X1() { return this.sX1 };
	get X2() { return this.sX2 };
	get Y1() { return this.sY1 };
	get Y2() { return this.sY2 };
	get Width() { return this.sWidth };
	get Color() { return this.sColor };

	set X1(value) 
	{ 
		this.sX1 = value;
		this.sSetAttributeNS('x1', this.sX1);
	};

	set X2(value) 
	{ 
		this.sX2 = value;
		this.sSetAttributeNS('x2', this.sX2);
	};

	set Y1(value) 
	{ 
		this.sY1 = value;
		this.sSetAttributeNS('y1', this.sY1);
	};

	set Y2(value) 
	{
		this.sY2 = value;
		this.sSetAttributeNS('y2', this.sY2);
	};
	
	set Width(value) 
	{
		this.sWidth = value;
		this.sSetAttributeNS('stroke-width', this.sWidth);
	};
	
	set Color(value) 
	{ 
		this.sColor = value;
		this.sSetAttributeNS('stroke', this.sColor);		
	};

	set Dash(value) 
	{
		this.sDash = value;	
		this.sSetAttributeNS('stroke-dasharray', this.sDash);
	}

	SetParent(elem) 
	{
		elem.appendChild(this.SelfElem);
	}
}

class Main 
{
	constructor(HolstId) 
	{
		this.sPointSelected = false;
		this.HolstId = HolstId;
		this.Line1 = new Line('line1');
		this.Line1.X1 = 100;
		this.Line1.Y1 = 200;
		this.Line1.X2 = 400;
		this.Line1.Y2 = 200;
		this.Line1.Width = 3;
		this.Line1.Color = "red";

		this.Line2 = new Line('line2');
		this.Line2.X1 = 100;
		this.Line2.Y1 = 100;
		this.Line2.X2 = 400;
		this.Line2.Y2 = 100;
		this.Line2.Width = 3;
		this.Line2.Color = "blue";

		this.sLockLine = null;
		this.sLockPointNum = 0;

		//<line id='line1' x1="100" y1="200" x2="400" y2="200" stroke-width="1" stroke="red"/>
		//<line id='line2' x1="100" y1="100" x2="400" y2="100" stroke-width="1" stroke="blue"/>
	
		let elem = document.getElementById(this.HolstId);
		this.Line1.SetParent(elem);
		this.Line2.SetParent(elem);
	
	}

	get PointSelected() { return this.sPointSelected; }
	set PointSelected(value) { this.sPointSelected = value; }

	// является ли точка testX, testY ближайшей к точке currx, curry
	IsNeareast(testX,testY,delta,currX,currY) 
	{
		if ( testX <= currX+delta && testX >= currX-delta && testY <= currY+delta && testY >= currY-delta) return true;
		return false;
	}

	HolstClick(E)
	{
		let cX = E.offsetX;
		let cY = E.offsetY;

		if (this.PointSelected) 
		{
			if (this.sLockPointNum==1) 
			{
				this.sLockLine.X1 = cX;
				this.sLockLine.Y1 = cY;
			}
			else if (this.sLockPointNum==2) 
			{
				this.sLockLine.X2 = cX;
				this.sLockLine.Y2 = cY;
			}
			this.sLockLine.Dash = "0,0";
			this.sLockLine = null;
			this.sLockPointNum = 0;
			this.PointSelected = false;
		}
		else 
		{
			// найдем ближайший конец линии +- 20 точек
			if (this.IsNeareast(this.Line1.X1, this.Line1.Y1, 30, cX, cY))
			{
				this.sLockLine = this.Line1;
				this.sLockPointNum = 1;				
				this.PointSelected = true;
			} 
			else if (this.IsNeareast(this.Line1.X2, this.Line1.Y2, 30, cX, cY))
			{
				this.sLockLine = this.Line1;
				this.sLockPointNum = 2;
				this.PointSelected = true;
			}
			else if (this.IsNeareast(this.Line2.X1, this.Line2.Y1, 30, cX, cY))
			{
				this.sLockLine = this.Line2;
				this.sLockPointNum = 1;
				this.PointSelected = true;
			}
			else if (this.IsNeareast(this.Line2.X2, this.Line2.Y2, 30, cX, cY))
			{
				this.sLockLine = this.Line2;
				this.sLockPointNum = 2;
				this.PointSelected = true;
			}
			if (this.PointSelected) this.sLockLine.Dash = "5,5";

		}
	}	

	HolstMove(E)
	{
		if (this.PointSelected) 
		{
			let cX = E.offsetX;
			let cY = E.offsetY;				
			if (this.sLockPointNum==1) 
			{
				this.sLockLine.X1 = cX;
				this.sLockLine.Y1 = cY;
			}
			else if (this.sLockPointNum==2) 
			{
				this.sLockLine.X2 = cX;
				this.sLockLine.Y2 = cY;
			}			
		}
	}

	CalculateCrossing(E)
	{
		alert('Calc');
	}
}

function EventInit()
{
	let elem = document.getElementById('Holst');
	elem.addEventListener('click', HolstClick);
	elem.addEventListener('mousemove', HolstMove);

	elem = document.getElementById('calc-cross');
	elem.addEventListener('click', CalculateCrossing);

}

function Init()
{
	AppMain = new Main('Holst');
	EventInit();
}


function HolstClick(E) 
{
	AppMain.HolstClick(E);
}

function HolstMove(E) 
{
	AppMain.HolstMove(E);
}

function CalculateCrossing(E) 
{
	AppMain.CalculateCrossing(E);
}


