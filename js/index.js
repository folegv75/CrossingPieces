window.onload = Init;
var xmlns = "http://www.w3.org/2000/svg";

var AppMain = {};


class Line
{
	constructor(Id)
	{
		this.sId = Id;
		this.SelfElem = document.createElementNS(xmlns, 'line');
		this.SelfElem.id = this.sId;

		// коэффциенты уравнений прямой вида y = k*x + b
		this.sCoefficientK = 0;
		this.sCoefficientB = 0;
		this.sEquationString = 'x = 0';
		
		this.sX1 = 0;
		this.sY1 = 0;
		this.sX2 = 0;
		this.sY2 = 0;
		this.sWidth = '2';
		this.sColor = 'black';
		this.Dash = "0,0";

		this.SelfElem.setAttributeNS(null, 'x1', this.sX1);
		this.SelfElem.setAttributeNS(null, 'y1', this.sY1);
		this.SelfElem.setAttributeNS(null, 'x2', this.sX2);
		this.SelfElem.setAttributeNS(null, 'y2', this.sY2);
		this.SelfElem.setAttributeNS(null, 'stroke', this.sColor);
		this.SelfElem.setAttributeNS(null, 'stroke-width', this.sWidth);
		//sSetAttributeNS('stroke-dasharray', this.sDash);
	}

	// private
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
	get CoefficientK() { return this.sCoefficientK; } 
	get CoefficientB() { return this.sCoefficientB; } 
	get EquationString() { return  this.sEquationString;}

	set X1(value) 
	{ 
		this.sX1 = value;
		this.sCalculateCoefficient();
		this.sSetAttributeNS('x1', this.sX1);
	};

	set X2(value) 
	{ 
		this.sX2 = value;
		this.sCalculateCoefficient(); 
		this.sSetAttributeNS('x2', this.sX2);
	};

	set Y1(value) 
	{ 
		this.sY1 = value;
		this.sCalculateCoefficient(); 
		this.sSetAttributeNS('y1', this.sY1);
	};

	set Y2(value) 
	{
		this.sY2 = value;
		this.sCalculateCoefficient();
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

	// private function
	sCalculateCoefficient() 
	{
		let L = this.sX2 - this.sX1;
		let H = this.sY2 - this.sY1;
		if (L==0) 
		{ 
			this.sCoefficientK = null;
			this.sCoefficientB = this.sY1;
			this.sEquationString = 'x = ' + this.sY1.toFixed(2);
		} 
		else
		{
			this.sCoefficientK = H / L;
			this.sCoefficientB = this.sY1 - this.sCoefficientK * this.sX1;

			if (this.sCoefficientB>=0) 
				this.sEquationString = 'y = ' + this.sCoefficientK.toFixed(2) + '*x + ' + this.sCoefficientB.toFixed(2);
			else 
				this.sEquationString = 'y = ' + this.sCoefficientK.toFixed(2) + '*x - ' + (-this.sCoefficientB.toFixed(2));		
		}
		
	}

	// public fucntion
	SetParent(elem) 
	{
		elem.appendChild(this.SelfElem);
	}
}

/** Class описывает точку. */
class Point 
{
	/** Создать точку
	* @param {number} x - координата x.
	* @param {number} y - координата y.
	*/	
	constructor (x,y)
	{
		this.sX = x;
		this.sY = y;
	}

	get X() { return this.sX; }
	get Y() { return this.sY; }
	set X(x) { this.sX=x; } 
	set Y(w) { this.sY=y; } 
}

/**
 * Перечисление описание точки пересечения
 * @readonly
 * @enum {number}
 */
var CrossingType = {
	/** Есть точка пересечения */
	INTERSECT : 1,
	/** Нет точки пересечения, прямые паралельны */
	PARALLEL : 2,
	/** Множество точек пересечения, прямые друг под другом */
	SET : 3
};

/** Class описывает точку пересечения */
class CrossingInfo
{
	/** Создать описание точки пересечения.
	* @param {Point} p - точка пересечения
	* @param {CrossingType} t - пересечения
	*/	
	constructor (p, t) 
	{
		this.sPoint = p;
		this.sType = t;
	}

	get Type() { return this.sType; }
	get Point() { return this.sPoint; }

	set Type(value) { this.sType = value; }
	set Point(value) { this.sPoint = value; }
}

class Main 
{
	constructor(HolstId) 
	{
		this.sPointSelected = false;
		this.HolstId = HolstId;
		this.RedLine = new Line('red-line');
		this.RedLine.X1 = 100;
		this.RedLine.Y1 = 200;
		this.RedLine.X2 = 400;
		this.RedLine.Y2 = 200;
		this.RedLine.Width = 3;
		this.RedLine.Color = "red";

		this.BlueLine = new Line('blue-line');
		this.BlueLine.X1 = 100;
		this.BlueLine.Y1 = 100;
		this.BlueLine.X2 = 400;
		this.BlueLine.Y2 = 100;
		this.BlueLine.Width = 3;
		this.BlueLine.Color = "blue";

		this.sLockLine = null;
		this.sLockPointNum = 0;
	
		let elem = document.getElementById(this.HolstId);
		this.RedLine.SetParent(elem);
		this.BlueLine.SetParent(elem);

		this.DisplayInfo();		
	
	}

	get PointSelected() { return this.sPointSelected; }
	set PointSelected(value) { this.sPointSelected = value; }

	// является ли точка testX, testY ближайшей к точке currx, curry
	IsNeareast(testX,testY,delta,currX,currY) 
	{
		if ( testX <= currX+delta && testX >= currX-delta && testY <= currY+delta && testY >= currY-delta) return true;
		return false;
	}

	DisplayInfo()
	{
		let blueElem = document.getElementById('blue-info');
		let redElem = document.getElementById('red-info');
		blueElem.innerHTML = this.BlueLine.EquationString;
		redElem.innerHTML = this.RedLine.EquationString;
	}

	HolstClick(E)
	{
		this.DisplayInfo();
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
			if (this.IsNeareast(this.RedLine.X1, this.RedLine.Y1, 30, cX, cY))
			{
				this.sLockLine = this.RedLine;
				this.sLockPointNum = 1;				
				this.PointSelected = true;
			} 
			else if (this.IsNeareast(this.RedLine.X2, this.RedLine.Y2, 30, cX, cY))
			{
				this.sLockLine = this.RedLine;
				this.sLockPointNum = 2;
				this.PointSelected = true;
			}
			else if (this.IsNeareast(this.BlueLine.X1, this.BlueLine.Y1, 30, cX, cY))
			{
				this.sLockLine = this.BlueLine;
				this.sLockPointNum = 1;
				this.PointSelected = true;
			}
			else if (this.IsNeareast(this.BlueLine.X2, this.BlueLine.Y2, 30, cX, cY))
			{
				this.sLockLine = this.BlueLine;
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
			this.DisplayInfo();
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
			this.OnCalculateCrossing(E);
		}
	}



	// 
	// 
	
	/** @description найти точку пересечения двух линий. Решение см. TZ.doc.
 	* @param {firstLine} первая линия  
 	* @param {secondLine} вторая линия
 	* @return {CrossingInfo}  - информация о пересечении
 	*/ 	
	CalculateCrossing(firstLine,secondLine)
	{
		let rez = null;
		// получили коэфффициенты для прямых y = ax+b (y = кx+b), если a== null, значит прямая вертикальная
		let A1 = firstLine.CoefficientK;
		let B1 = firstLine.CoefficientB;
		let A2 = secondLine.CoefficientK;
		let B2 = secondLine.CoefficientB;

		// проверим случай паралелльных прямых
		if (A1==A2) 
		{
			// если прямые вертикальные
			if (A1==null) 
			{ 
				// проверим совпадают ли вертикальные прямые, т.е. совпадают ли координаты x
				if (firstLine.X1 == firstLine.X2) rez = new CrossingInfo(null, CrossingType.SET);
				else rez = new CrossingInfo(null, CrossingType.PARALLEL);
			} 
			else 
			{
				// проверим совпадают ли прямые, углы наклона одинаковые, проверим совпадают ли коээфициенты b
				if (B1==B2) rez = new CrossingInfo(null, CrossingType.SET);
				else rez = new CrossingInfo(null, CrossingType.PARALLEL);
			}
		}
		// если первая прямая вертикальная
		else if (A1==null) 
		{
			// подставим X координату из первой прямой в уравнение второй и получим координату y пересечения
			let y = A2 * firstLine.X1 + B2;
			rez = new CrossingInfo(new Point(firstLine.X1, y), CrossingType.INTERSECT);
		}
		// если вторая прямая вертикальная
		else if (A2==null) 
		{
			// подставим X координату из второй прямой в уравнение первой и получим координату y пересечения
			let y = A1 * secondLine.X1 + B1;
			rez = new CrossingInfo(new Point(secondLine.X1, y), CrossingType.INTERSECT);
		}
		// общий случай
		else
		{
			// координату X нашли из решения системы уравнений
			let x = (B2-B1) / (A1-A2);
			// координату Y находим подставляя X в уравненией первой прямой
			let y = A1*x + B1;
			rez = new CrossingInfo(new Point(x, y), CrossingType.INTERSECT);			
		}
		return rez;
	}


	OnCalculateCrossing(E) 
	{
		let IntersectPoint = this.CalculateCrossing(this.BlueLine,this.RedLine);
		let elem = document.getElementById('intersect-info');

		if (IntersectPoint.Point==null) elem.innerHTML = "X=null Y=null; Тип: ";
		else elem.innerHTML = "X=" + IntersectPoint.Point.X.toFixed(2) + " Y=" + IntersectPoint.Point.Y.toFixed(2) + " Тип: ";
		
		switch (IntersectPoint.Type) 
		{
			case CrossingType.INTERSECT: elem.innerHTML += "Пересечение";
			break;
			case CrossingType.PARALLEL: elem.innerHTML += "Параллельно";
			break;
			case CrossingType.SET: elem.innerHTML += "Множество";
			break;
		}		
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
	AppMain.OnCalculateCrossing(E);
}


