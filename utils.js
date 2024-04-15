
function SleepFor(aSleepDuration)
{
    if (typeof aSleepDuration !== 'number')
    {
        console.log("aSleepDuration must be a number, not " + typeof aSleepDuration);
    } 
    else if (aSleepDuration < 0)
    {
        console.log("aSleepDuration can't be negative.");
    }

    return new Promise (resolve => setTimeout(resolve, aSleepDuration));
}

//https://www.geeksforgeeks.org/how-to-pause-and-play-a-loop-in-javascript-using-event-listeners/
function SleepUntilClick(aElement)
{
    // Wait until the button is pressed.
    return new Promise(resolve => 
        {
            // The function to call when aButton is pressed.
            const RemoveListenerAndResolve = () =>
            {
                aElement.removeEventListener('click', RemoveListenerAndResolve);
                resolve("");
            }

            // Add an event listener that results in RemoveListenerAndResolve being called when aButton is clicked.
            aElement.addEventListener('click', RemoveListenerAndResolve);
        });
}

function SleepUntilClicks(aElements)
{
    if (!(aElements instanceof Array))
    {
        console.log("aElements must be an array.");
        return;
    }
    else if (!aElements.every(e => e instanceof Element))
    {
        console.log("Every item of aElements must be a DOM element.");
        return;
    }

    // Wait until the button is pressed.
    return new Promise(resolve => 
        {
            // The function to call when aButton is pressed.
            const RemoveListenersAndResolve = () =>
            {
                // Remove all of the listeners.
                aElements.forEach(e => e.removeEventListener('click', RemoveListenersAndResolve));

                resolve("");
            }
            
            // Add an event listener to each element that results in RemoveListenerAndResolve being called.
            // This means that any of the elements can be clicked to resolve the promise.
            aElements.forEach(e => e.addEventListener('click', RemoveListenersAndResolve));
        });
}

/*
* This function returns a random number between aMin and aMax (inclusive of both, i.e. [aMin, aMax]).

* Parameters:
    > aMin: the minimum value of the random number.
    > aMax: the maximum value of the random number.
*/
function GetRandom(aMin, aMax)
{
    return Math.floor(Math.random() * (aMax - aMin + 1)) + aMin;
}

function GetRandomProperty(aObject)
{
    if (!(typeof aObject !== "Object"))
    {
        console.log("aObject must be an object.");
        return;
    }

    // aObject's keys.
    const lKeys = Object.keys(aObject);

    // Validation for empty objects.
    if (lKeys.length === 0)
    {
        console.log("aObject is empty.");
        return;
    }

    // A random key of aObject.
    const lRandomKey = lKeys[GetRandom(0, lKeys.length - 1)];

    return aObject[lRandomKey];
}

/*
* Returns the dimenions (width and height) of the given DOM element's content. This function works regardless of the 
  element's 'box-sizing' property: i.e. if it's 'border-box', the padding and border are excluded.

* Parameters:
    > aElement: the DOM element whose dimenions will be returned. 
*/
function GetContentDimensions(aElement)
{
    if (!(aElement instanceof Element))
    {
        console.log("aElement must be a DOM element.");
        return;
    }

    const lElementStyle = window.getComputedStyle(aElement);

    const lDimenions = { width: parseFloat(lElementStyle.width), height: parseFloat(lElementStyle.height) };

    if (lElementStyle.boxSizing === 'border-box')
    {
        const lPadding = lElementStyle.padding.split(" ").map(i => parseFloat(i));

        if (lPadding.length === 1)
        {
            lDimenions.width -= 2 * lPadding[0];
            lDimenions.height -= 2 * lPadding[0];
        }
        else if (lPadding.length === 2 || lPadding.length === 3)
        {
            lDimenions.width -= 2 * lPadding[1];
            lDimenions.height -= 2 * lPadding[0];
        }
        else if (lPadding.length === 3)
        {
            lDimenions.width -= 2 * lPadding[1];
            lDimenions.height -= lPadding[0] + lPadding[2];
        }
        else
        {
            lDimenions.width -= (lPadding[1] + lPadding[3]);
            lDimenions.height -= (lPadding[0] + lPadding[2]);
        }

        const lBorderWidths = 
        [ 
            parseFloat(lElementStyle.borderTop.split(" ")[0]), parseFloat(lElementStyle.borderRight.split(" ")[0]),
            parseFloat(lElementStyle.borderBottom.split(" ")[0]), parseFloat(lElementStyle.borderLeft.split(" ")[0]) 
        ];

        //console.log(lBorderWidths);

        lDimenions.width -= lBorderWidths[1] + lBorderWidths[3];
        lDimenions.height -= lBorderWidths[0] + lBorderWidths[2];
    }

    return lDimenions;
}

function GetElementStyleProperty(aElement, aProperty)
{
    return window.getComputedStyle(aElement).getPropertyValue(aProperty);
}

function SetInLocalStorage(aKey, aValue)
{
    if (aValue instanceof Map)
    {
        console.log("Storing a map in local storage.");

        localStorage[aKey] = JSON.stringify(Array.from(aValue));
    }
    else if (aValue instanceof Array)
    {
        console.log("Storing an object in local storage.");

        localStorage[aKey] = JSON.stringify(aValue);
    }
    else if (typeof aValue === 'object')
    {
        console.log("Storing an object in local storage.");

        localStorage[aKey] = JSON.stringify(aValue);
    }
    else
    {
        localStorage[aKey] = aValue;
    }

}

function GetFromLocalStorage(aKey)
{
    const lString = localStorage[aKey];

    return JSON.parse(lString);
}

function GetMapFromLocalStorage(aKey)
{
    const lString = localStorage[aKey];

    return new Map(JSON.parse(lString));
}

/*
* If the supplied dimensions (aWidth and aHeight) fit within their desired maximums, said dimensions are returned; 
  otherwise, the dimensions are altered (preserving aspect ratio) such that they both are at or below their maximums.
*/
function FitMaxDimensions(aWidth, aHeight, aMaxWidth, aMaxHeight)
{
    // The image's aspect ratio.
    const lAspectRatio = aWidth / aHeight;

    if (aWidth > aMaxWidth && aHeight > aMaxHeight)
    {
        aWidth = aMaxWidth;

        aHeight = aWidth / lAspectRatio;

        // If the height is still greater than the max after adjusting for width.
        if (aHeight > aMaxHeight)
        {
            aHeight = aMaxHeight;

            aWidth = aHeight * lAspectRatio;
        }
    }
    else if (aWidth > aMaxWidth)
    {
        aWidth = aMaxWidth;

        aHeight = aWidth / lAspectRatio;
    }
    else if (aHeight > aMaxHeight)
    {
        aHeight = aMaxHeight;

        aWidth = aHeight * lAspectRatio;
    }

    return { width: aWidth, height: aHeight };
}

function Compare(aNum1, aOperator, aNum2)
{
    if (aOperator === utils.CompOps.G)
    {
        return aNum1 > aNum2;
    }
    else if (aOperator === utils.CompOps.L)
    {
        return aNum1 < aNum2;
    }
    else if (aOperator === utils.CompOps.GE)
    {
        return aNum1 >= aNum2;
    }
    else if (aOperator === utils.CompOps.LE)
    {
        return aNum1 <= aNum2;
    }
    else if (aOperator === utils.CompOps.E)
    {
        return aNum1 === aNum2;
    }
    else if (aOperator === utils.CompOps.NE)
    {
        return aNum1 !== aNum2;
    }

    console.log("Unknown comparison operator.");
    return true;
}

// An 'enum' for representing comparison operators.
const CompOps = Object.freeze(
    {
        E: 'E',  // Equals (===)
        NE: 'NE', // Not Equals (!==)
        G: 'G',  // Greater (>)
        L: 'L',  // Less than (<)
        GE: 'GE', // Greater or Equal (>=)
        LE: 'LE'  // Less than or Equal (<=)
    });

const utils =
{
    SleepFor: SleepFor,
    SleepUntilClick: SleepUntilClick,
    SleepUntilClicks: SleepUntilClicks,
    GetRandom: GetRandom,
    GetRandomProperty,
    GetContentDimensions: GetContentDimensions,
    GetElementStyleProperty: GetElementStyleProperty,
    SetInLocalStorage: SetInLocalStorage,
    GetFromLocalStorage: GetFromLocalStorage,
    GetMapFromLocalStorage: GetMapFromLocalStorage,
    FitMaxDimensions: FitMaxDimensions,
    Compare: Compare,
    CompOps: CompOps
};

// Export functions.
export { utils as default };
