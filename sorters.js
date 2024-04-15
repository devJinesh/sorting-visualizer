import utils from './utils.js';
import SortableImage from './SortableImage.js';


async function QuickSort(aImage, aAscending)
{
    const lOperator = aAscending ? utils.CompOps.G : utils.CompOps.L;

    const SortValue = async (aStart, aEnd) =>
    {
        // The index of the value that is to be placed into its sorted position.
        let lIndexPivot = aEnd;

        // The index at which lIndexPivot's value will ultimately be placed.
        let lIndexOfSort = aStart;

        for (let i = aStart; i < aEnd; ++i)
        {   
            if (aImage.Compare(lIndexPivot, lOperator, i))
            {
                // Swap current value with the one at lIndexOfSort.
                if (i !== lIndexOfSort)
                    await aImage.SwapPixels(i, lIndexOfSort);

                ++lIndexOfSort;
            }
    
        }

        // Move the pivot's value into its sorted position.
        if (lIndexOfSort !== lIndexPivot)
        { await aImage.SwapPixels(lIndexOfSort, lIndexPivot); }

        // Return the index of the value sorted by this algorithm.
        return lIndexOfSort;
    }

    const SplitElements = async (aStart, aEnd) => 
    {
        if (aImage.stop)
            return;

        if (aStart < aEnd)
        {
            const lIndexSortedValue = await SortValue(aStart, aEnd);

            const lSizeBottom = (lIndexSortedValue - 1) - aStart + 1;
            const lSizeTop = aEnd - (lIndexSortedValue + 1) + 1;

            // Always recurse into the smallest segment (this ensures the recursion depth is O(log(N))).
            // https://stackoverflow.com/questions/12792738/quicksort-which-sub-part-should-be-sorted-first
            if (lSizeBottom <= lSizeTop)
            {
                await SplitElements(aStart, lIndexSortedValue - 1);
                await SplitElements(lIndexSortedValue + 1, aEnd);
            }
            else
            {
                await SplitElements(lIndexSortedValue + 1, aEnd);
                await SplitElements(aStart, lIndexSortedValue - 1);
            }
        }

    }

    await SplitElements(0, aImage.length - 1);
}

async function QuickSortRandomPivot(aImage, aAscending)
{
    const lOperator = aAscending ? utils.CompOps.G : utils.CompOps.L;

    const SortValue = async (aStart, aEnd) =>
    {
        // The index of the value that is to be placed into its sorted position.
        let lIndexPivot = utils.GetRandom(aStart, aEnd);

        await aImage.SwapPixels(lIndexPivot, aEnd);

        lIndexPivot = aEnd;

        // The index at which lIndexPivot's value will ultimately be placed.
        let lIndexOfSort = aStart;

        for (let i = aStart; i < aEnd; ++i)
        {   
            if (aImage.Compare(lIndexPivot, lOperator, i))
            {
                // Swap current value with the one at lIndexOfSort.
                if (i !== lIndexOfSort)
                    await aImage.SwapPixels(i, lIndexOfSort);

                ++lIndexOfSort;
            }
    
        }

        // Move the pivot's value into its sorted position.
        if (lIndexOfSort !== lIndexPivot)
        { await aImage.SwapPixels(lIndexOfSort, lIndexPivot); }

        // Return the index of the value sorted by this algorithm.
        return lIndexOfSort;
    }

    const SplitElements = async (aStart, aEnd) => 
    {
        if (aImage.stop)
            return;

        if (aStart < aEnd)
        {
            const lIndexSortedValue = await SortValue(aStart, aEnd);

            const lSizeBottom = (lIndexSortedValue - 1) - aStart + 1;
            const lSizeTop = aEnd - (lIndexSortedValue + 1) + 1;

            // Always recurse into the smallest segment (this ensures the recursion depth is O(log(N))).
            // https://stackoverflow.com/questions/12792738/quicksort-which-sub-part-should-be-sorted-first
            if (lSizeBottom <= lSizeTop)
            {
                await SplitElements(aStart, lIndexSortedValue - 1);
                await SplitElements(lIndexSortedValue + 1, aEnd);
            }
            else
            {
                await SplitElements(lIndexSortedValue + 1, aEnd);
                await SplitElements(aStart, lIndexSortedValue - 1);
            }
        }

    }

    await SplitElements(0, aImage.length - 1);
}

async function SelectionSort(aImage, aAscending)
{
    // Determine the comparison operator to use.
    const lCompOp = aAscending ? utils.CompOps.G : utils.CompOps.L;

    let lIndexElementToSwap;

    for (let lIndexUnsortedUpper = aImage.length - 1; lIndexUnsortedUpper > 0; --lIndexUnsortedUpper)
    {
        lIndexElementToSwap = 0;

        for (let i = 1; i <= lIndexUnsortedUpper; ++i)
        {
            if (aImage.Compare(i, lCompOp, lIndexElementToSwap))
            {
                lIndexElementToSwap = i;
            }
        }

        await aImage.SwapPixels(lIndexElementToSwap, lIndexUnsortedUpper);
    }

}

async function MergeSort(aImage, aAscending)
{
    const lOperator = aAscending ? utils.CompOps.LE : utils.CompOps.GE;

    const Merge = async (aStart, aMid, aEnd) =>
    {   
        // Create a temporary container to house the merged segment.
        const lSizeOfMerger = aEnd - aStart + 1; // Size of merged segment.
        let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

        // (a). The current indexes of the lower and upper segments, respectively.
        let lIndexLowerSegment = aStart;
        let lIndexUpperSegment = aMid + 1;

        // (b). The 'current' index of lMerger.
        let lMergerIndex = 0;
        
        // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
        while (true) // (c).
        {
            if (lIndexLowerSegment <= aMid && lIndexUpperSegment <= aEnd) // (d).
            {
                if (aImage.Compare(lIndexLowerSegment, lOperator, lIndexUpperSegment)) // (e).
                {
                    lMerger[lMergerIndex++] = { index: aImage.GetIndex(lIndexLowerSegment), colour: aImage.GetPixelColour(lIndexLowerSegment) };
                    ++lIndexLowerSegment;
                }
                else // (f).
                {
                    lMerger[lMergerIndex++] = { index: aImage.GetIndex(lIndexUpperSegment), colour: aImage.GetPixelColour(lIndexUpperSegment) };
                    ++lIndexUpperSegment;
                }
                
            }
            else if (lIndexLowerSegment <= aMid) // (g).
            {
                lMerger[lMergerIndex++] = { index: aImage.GetIndex(lIndexLowerSegment), colour: aImage.GetPixelColour(lIndexLowerSegment) };
                ++lIndexLowerSegment;
            }
            else if (lIndexUpperSegment <= aEnd) // (h).
            {
                lMerger[lMergerIndex++] = { index: aImage.GetIndex(lIndexUpperSegment), colour: aImage.GetPixelColour(lIndexUpperSegment) };
                ++lIndexUpperSegment;
            }
            else // (i).
            {
                break;
            }
            
        }

        // Copy the values from lMerger into the appropriate indexes.
        for (let i = aStart; i <= aEnd; ++i) 
        { 
            await aImage.SetIndexAndPixel(i, lMerger[i - aStart].index, lMerger[i - aStart].colour);
        }
    }

    const SplitAndMerge = async (aStart, aEnd) => 
    {
        if (aImage.stop)
            return;

        if (aStart >= aEnd)
        { return; }
        
        // Calculate the middle index.
        let lMid = Math.floor((aStart + aEnd) / 2);
        
        // Split and merge the lower half of the current segment (aStart to lMid).
        // Once this returns, said lower half will have been sorted.
        await SplitAndMerge(aStart, lMid);
        
        // Continue to split and merge the upper half of the current segment (lMid + 1 to aEnd).
        // Once this returns, said upper half will have been sorted.
        await SplitAndMerge(lMid + 1, aEnd);

        if (aImage.stop)
            return;
        
        // Combine the lower (aStart to lMid) and upper (lMid + 1 to aEnd) segments which, individually, are sorted.
        await Merge(aStart, lMid, aEnd);
    }

    await SplitAndMerge(0, aImage.length - 1);
}

async function MergeSortIterative(aImage, aAscending)
{
    const lOperator = aAscending ? utils.CompOps.LE : utils.CompOps.GE;

    const Merge = async (aStart, aMid, aEnd) =>
    {   
        // Create a temporary container to house the merged segment.
        const lSizeOfMerger = aEnd - aStart + 1; // Size of merged segment.
        let lMerger = Array(lSizeOfMerger); // Array to hold the merged values of lower and upper segments.

        // (a). The current indexes of the lower and upper segments, respectively.
        let lIndexLowerSegment = aStart;
        let lIndexUpperSegment = aMid + 1;

        // (b). The 'current' index of lMerger.
        let lMergerIndex = 0;
        
        // The purpose of this while loop is to populate lMerger with all elements from lower and upper segments.
        while (true) // (c).
        {
            if (lIndexLowerSegment <= aMid && lIndexUpperSegment <= aEnd) // (d).
            {
                if (aImage.Compare(lIndexLowerSegment, lOperator, lIndexUpperSegment)) // (e).
                {
                    lMerger[lMergerIndex++] = { index: aImage.GetIndex(lIndexLowerSegment), colour: aImage.GetPixelColour(lIndexLowerSegment) };
                    ++lIndexLowerSegment;
                }
                else // (f).
                {
                    lMerger[lMergerIndex++] = { index: aImage.GetIndex(lIndexUpperSegment), colour: aImage.GetPixelColour(lIndexUpperSegment) };
                    ++lIndexUpperSegment;
                }
                
            }
            else if (lIndexLowerSegment <= aMid) // (g).
            {
                lMerger[lMergerIndex++] = { index: aImage.GetIndex(lIndexLowerSegment), colour: aImage.GetPixelColour(lIndexLowerSegment) };
                ++lIndexLowerSegment;
            }
            else if (lIndexUpperSegment <= aEnd) // (h).
            {
                lMerger[lMergerIndex++] = { index: aImage.GetIndex(lIndexUpperSegment), colour: aImage.GetPixelColour(lIndexUpperSegment) };
                ++lIndexUpperSegment;
            }
            else // (i).
            {
                break;
            }
            
        }

        // Copy the values from lMerger into the appropriate indexes.
        for (let i = aStart; i <= aEnd; ++i) 
        { 
            await aImage.SetIndexAndPixel(i, lMerger[i - aStart].index, lMerger[i - aStart].colour);
        }
    }

    // (a).
    let l_segment_size; // Current size of segment to split and merge (range: 2 to l_max_segment_size).
    let lStart; // First index of segment (first index of lower half).
    let lMid; // Middle index of segment (last index of lower half, first index of lower half).
    let lEnd; // Last index of segment (last index of upper half).

    // (b). Not necessary to make these variables, but it does help with readability.
    let l_container_max_index = aImage.length - 1;
    let l_container_size = aImage.length;

    // (c). Calculate and store the maximum length of a segment.
    let l_max_segment_size = 1;
    while (l_max_segment_size < l_container_size)
    { l_max_segment_size *= 2; }

    for (l_segment_size = 2; l_segment_size <= l_max_segment_size; l_segment_size *= 2) // (d).
    {
        for (lStart = 0; lStart <= l_container_max_index - Math.floor(l_segment_size / 2); lStart += l_segment_size) // (e).
        {
            if (aImage.stop)
                return;

            // (f). Calculate middle index of segment lStart to lEnd (max index of lower half).
            lMid = lStart + Math.floor((l_segment_size / 2)) - 1;

            // (g). Calculate max index of segment lStart to lEnd (max index of upper half).
            let lEnd_candidate = lStart + l_segment_size - 1;
            if (lEnd_candidate < l_container_max_index)
            {
                lEnd = lEnd_candidate;
            }
            else
            {
                lEnd = l_container_max_index;
            }

            // Combine the lower (lStart to lMid) and upper (lMid + 1 to lEnd) halves of the current segment.
            await Merge(lStart, lMid, lEnd);
        }
        
    }

}

async function HeapSort(aImage, aAscending)
{
    const MaxHeapify = async (aIndexLastNode, aIndexParentNode) => 
    {
        if (aImage.stop)
            return;

        // (a).
        let lIndexMaxValue = aIndexParentNode;

        // (b).
        let lIndexLeftChild = 2 * aIndexParentNode + 1;
        let lIndexRightChild = 2 * aIndexParentNode + 2;

        if (lIndexLeftChild <= aIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the left child's value is higher than that of its parent.
            if (aImage.Compare(lIndexLeftChild, utils.CompOps.G, lIndexMaxValue))
            {
                lIndexMaxValue = lIndexLeftChild;
            }

        }

        if (lIndexRightChild <= aIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the right child's value is higher than that of the current max.
            if (aImage.Compare(lIndexRightChild, utils.CompOps.G, lIndexMaxValue))
            {
                lIndexMaxValue = lIndexRightChild;
            }
            
        }

        if (lIndexMaxValue != aIndexParentNode) // (d).
        {
            // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
            await aImage.SwapPixels(lIndexMaxValue, aIndexParentNode);

            await MaxHeapify(aIndexLastNode, lIndexMaxValue); // (e).
        }

    }

    const MinHeapify = async (aIndexLastNode, aIndexParentNode) => 
    {
        if (aImage.stop)
            return;

        // (a).
        let lIndexMinValue = aIndexParentNode;

        // (b).
        let lIndexLeftChild = 2 * aIndexParentNode + 1;
        let lIndexRightChild = 2 * aIndexParentNode + 2;

        if (lIndexLeftChild <= aIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the left child's value is higher than that of its parent.
            if (aImage.Compare(lIndexLeftChild, utils.CompOps.L, lIndexMinValue))
            {
                lIndexMinValue = lIndexLeftChild;
            }

        }

        if (lIndexRightChild <= aIndexLastNode) // (c). If valid index.
        {
            // Reassign the max index if the right child's value is higher than that of the current max.
            if (aImage.Compare(lIndexRightChild, utils.CompOps.L, lIndexMinValue))
            {
                lIndexMinValue = lIndexRightChild;
            }
            
        }

        if (lIndexMinValue != aIndexParentNode) // (d).
        {
            // Swap value of current parent with that of its highest-value child (whose value is higher than its). 
            await aImage.SwapPixels(lIndexMinValue, aIndexParentNode);

            await MinHeapify(aIndexLastNode, lIndexMinValue); // (e).
        }

    }


    let lIndexLowestParentNode = Math.floor((aImage.length / 2) - 1);

    for (let i = lIndexLowestParentNode; i >= 0; --i)
    {
        aAscending ? await MaxHeapify(aImage.length - 1, i) : 
                     await MinHeapify(aImage.length - 1, i);
    }

    for (let lIndexLastNode = aImage.length - 1; lIndexLastNode >= 0;)
    {
        if (aImage.stop)
            return;

        await aImage.SwapPixels(0, lIndexLastNode);

        aAscending ? await MaxHeapify(--lIndexLastNode, 0) : 
                     await MinHeapify(--lIndexLastNode, 0);     
    }

}

async function ShellSort(aImage, aAscending)
{
    // source: https://www.geeksforgeeks.org/shellsort/

    // The operator to use in the while loop's condition.
    const lOperator = aAscending ? utils.CompOps.G : utils.CompOps.L;

    // The length of the image (i.e. number of pixels).
    let lLengthImage = aImage.length;
  
    /*
    * Perform insertion sort on all sublists of aImage where each sublist is comprised of elements of aImage that
      are 'gap' indexes apart from each other.
    */
    for (let gap = Math.floor(lLengthImage / 2); gap > 0; gap = Math.floor(gap / 2))
    {
        // The maximum index (which is an index of aImage) of the current sublist.
        let lIndexMaxSubList = gap;

        /*
        * Each iteration of this for loop performs an insertion sort on one of the sublists. 
        * A sublist's size, given by lIndexMaxSubList, is increased by 1 every time it is iterated over.
        * Each successive iteration of the loop focuses on a different sublist. Each sublist is iterated over several 
          times (equal to its (final) length minus 1).
        * Each sublist mustn't contain the same element as another sublist.
        * The number of elements in a sublist is, at most, n / gap (s = n /gap); the number of sublists is n / s.
        */
        for (; lIndexMaxSubList < lLengthImage; ++lIndexMaxSubList)
        {
            //const lValueToInsert = aImage.GetClientHeight(lIndexMaxSubList);
            const lValueToInsert = { index: aImage.GetIndex(lIndexMaxSubList), colour: aImage.GetPixelColour(lIndexMaxSubList) };

            // The index of the sublist at which lValueToInsert will be inserted.
            let lIndexOfInsert = lIndexMaxSubList;

            // The lowest index of the sublist.
            let lIndexMinSublist = lIndexMaxSubList % gap;

            for (; lIndexOfInsert > lIndexMinSublist && aImage.CompareValue(lIndexOfInsert - gap, lOperator, lValueToInsert.index);
                   lIndexOfInsert -= gap)
            {
                if (aImage.stop)
                    return;

                const lValue = { index: aImage.GetIndex(lIndexOfInsert - gap), colour: aImage.GetPixelColour(lIndexOfInsert - gap) };

                //aImage.SetHeight(lIndexOfInsert, aImage.GetHeight(lIndexOfInsert - gap));
                await aImage.SetIndexAndPixel(lIndexOfInsert, lValue.index, lValue.colour);
            }

            //aImage.SetHeight(lIndexOfInsert, `${lValueToInsert}px`);
            await aImage.SetIndexAndPixel(lIndexOfInsert, lValueToInsert.index, lValueToInsert.colour);
        }

    }

}


const Sorters = 
{
    // "Bubble Sort": BubbleSort,
    // "Cocktail-Shaker Sort": CocktailShakerSort,
    //"Selection Sort": SelectionSort,
    // "Insertion Sort": InsertionSort,
    "Quick Sort": QuickSortRandomPivot,
    "Merge Sort": MergeSort,
    "Merge Sort (Iterative)": MergeSortIterative,
    "Heap Sort": HeapSort,
    "Shell Sort": ShellSort
};

export { Sorters as default };