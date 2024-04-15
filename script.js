//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas
// https://github.com/mdn/dom-examples/tree/main/canvas/pixel-manipulation

import SortableImage from "./SortableImage.js";

import sorters from "./sorters.js";

const gBtnSort = document.getElementById("btnSort");
const gBtnShuffle = document.getElementById("btnShuffle");
const gChkAscending = document.getElementById("chkAscending");
const gCmbSorters = document.getElementById("cmbSorters");
const gUplImgage = document.getElementById("uplImage");

const gPrimaryControls = [ gBtnSort, gBtnShuffle, gChkAscending, gCmbSorters, gUplImgage ];

let gSortableImage;

const gRngSpeed = document.getElementById("rngSpeed");


function init()
{
    const gMaxImgWidth = window.innerWidth * 0.75;
    const gMaxImgHeight = window.innerHeight * 0.75;
    console.log("Max Width: " + gMaxImgWidth);
    console.log("Max Height: " + gMaxImgHeight);

    const lBtnStop = document.getElementById("btnStop");
    const lBtnDownload = document.getElementById("btnDownload")

    gSortableImage = new SortableImage("./images/mona_lisa_small.jpg", document.getElementById("conImageCanvas"),
                                       lBtnStop, document.getElementById("btnStep"), document.getElementById("chkStep"), 
                                       gMaxImgWidth, gMaxImgHeight);

    gBtnShuffle.onclick = Shuffle;
    gBtnSort.onclick = Sort;
    lBtnStop.onclick = Stop;
    lBtnDownload.onclick = Download;

    gRngSpeed.onchange = ChangeSortSpeed;
    ChangeSortSpeed();

    PopulateComboBox();

    gUplImgage.onchange = function() 
    {
        const lFile = gUplImgage.files[0];

        const lReader = new FileReader();

        lReader.onload = function()
        {
            //console.log(lReader.result);
            gSortableImage.SetImage(lReader.result);
        }

        lReader.readAsDataURL(lFile);
    }

}
window.onload = init;

async function Shuffle()
{
    ToggleUIDisabled();

    await gSortableImage.Shuffle();

    ToggleUIDisabled();
};


async function Sort()
{
    ToggleUIDisabled();

    await gSortableImage.Sort(sorters[gCmbSorters.options[gCmbSorters.selectedIndex].text], gChkAscending.checked);

    ToggleUIDisabled();
}

function ChangeSortSpeed()
{
    gSortableImage.SetMaxCount(Number(gRngSpeed.value));
}

function Stop()
{
    gSortableImage.Stop();
}

function Download()
{
    const lLink = document.createElement('a');
    lLink.download = 'download.png';
    lLink.href = gSortableImage.canvas.toDataURL();
    lLink.click();
    lLink.delete;
}

function ToggleUIDisabled()
{
    for (let i = 0; i < gPrimaryControls.length; ++i)
    {
        gPrimaryControls[i].disabled = !gPrimaryControls[i].disabled;
    }

    // gBtnShuffle.disabled = !gBtnShuffle.disabled;
    // gBtnSort.disabled = !gBtnSort.disabled;
    // gChkAscending.disabled = !gChkAscending.disabled;
    // gCmbSorters.disabled = !gCmbSorters.disabled;
}

function PopulateComboBox()
{
    Object.keys(sorters).forEach(sorter =>
        {
            const lOption = document.createElement("option");

            lOption.textContent = sorter;

            gCmbSorters.appendChild(lOption);
        });
}
