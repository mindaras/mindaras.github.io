d3.select('form')
  .on('submit', function() {
    let input,
        word,
        wordData = [],
        letters;


    input = d3.select('input');

    word = input.node().value;

    d3.event.preventDefault();

    word.split('').sort().forEach(curr => {
      let lastWord = wordData[wordData.length - 1];

      if (lastWord && lastWord.character === curr) {
        lastWord.count++;
      } else {
        wordData.push({character: curr, count: 1});
      }

    });

    letters = d3.select('#letters')
      .selectAll('.letter')
      .data(wordData, function(d) {
        return d.character;
      });

    letters
        .classed('new', false)
      .exit()
      .remove();

    letters
      .enter()
      .append('div')
        .classed('letter', true)
        .classed('new', true)
      .merge(letters)
        .style('width', '20px')
        .style('line-height', '20px')
        .style('margin-right', '5px')
        .style('height', function(d) {
          return d.count * 20 + 'px';
        })
        .text(function(d) {
          return d.character;
        });

    d3.select('#phrase')
      .text(`Analysis of: ${word}`);

    d3.select('#count')
      .text(`(New characters: ${letters.enter().nodes().length})`);

    input.property('value', '');

  });

d3.select('#reset')
  .on('click', function() {

    d3.selectAll('.letter')
      .remove();

    d3.select('#phrase')
      .text('');

    d3.select('#count')
      .remove();
  });
