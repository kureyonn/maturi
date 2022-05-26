<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Choice based conjoint measurement</title>
  <script src="jspsych/dist/jspsych.js"></script>
  <script src="jspsych/dist/plugin-fullscreen.js"></script>
  <script src="jspsych/dist/plugin-html-keyboard-response.js"></script>
  <script src="jspsych/dist/plugin-image-keyboard-response.js"></script>
  <script src="jspsych/dist/plugin-survey-multi-choice.js"></script>
  <script src="jspsych/dist/plugin-preload.js"></script>
  <script src="jspsych/dist/plugin-survey-text.js"></script>
  <link rel="stylesheet" href="jspsych/dist/jspsych.css">
  <script src="stimuli.js"></script>
  <style>
    table {
      margin-left: auto;
      margin-right: auto;
      border-collapse: collapse;
      /* width: 700px; */
      margin-top: 50px;
      margin-bottom: 50px;
    }

    th,
    td {
      padding: 20px 15px;
    }

    th {
      width: 25%;
      background-color: #ddd;
      border-right: 1px dotted #fff;
    }

    th.border-none {
      border-right: none;
    }

    td {
      border-bottom: 1px solid #aaa;
      text-align: center;
    }

    .a1 {
      background-color: #ddd;
      border-right: 1px dotted #fff;
    }

    table tr:last-child td {
      border: none;
    }
  </style>

  </style>
</head>

<body></body>

<script>

  const font_size = 20;
  const stim_size = 60;


/* 表示する選択肢の組み合わせをランダムに抽出する*/
  var N_CHOICE = 30; // 20 < N_CHOICE
  var randoms = [];
  var min = 0;
  var max = Object.keys(test_stimuli).length - 1; // 36
  function intRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  for (j = 0; j < N_CHOICE; j++) {
    tmp = [];
    for (i = 1; i <= 3; i++) {
      while (true) {
        var ran = intRandom(min, max);
        if (!tmp.includes(ran)) {
          tmp.push(ran);
          break;
        }
      }
    }
    randoms[j] = tmp;
  }
  // console.log(randoms);


  // Initialize jsPsych
  var jsPsych = initJsPsych({
    on_finish: function () {
      jsPsych.data.displayData();
      jsPsych.data.addProperties(par_info);
      jsPsych.data.get().localSave("csv", `${par_info.id}.csv`)
    }
  });

  var fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true,
    message: `<span style='font-size:${font_size}pt;'><p>下のボタンを押して、全画面表示にしてください。</p></span>`,
    button_label: '全画面表示にする'
  };

  var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <span style='font-size:${font_size}pt;'>
      <p>このたびは、実験にご協力いただきありがとうございます。</p>
      <p>スペースキーを押すと、画面が切り替わります。</p>
    </span>
    `,
    choices: ` `,
  };

  var par_info = {};
  var id = {
    type: jsPsychSurveyText,
    questions: [
      { prompt: '参加者IDを入力してください', columns: 10, required: true, name: 'participantID' },
    ],
    button_label: '次へ',
    on_finish: function (data) {
      par_info.id = data.response.participantID // 一時保存
    }
  };
  var age = {
    type: jsPsychSurveyText,
    questions: [
      {
        prompt: `<span style='font-size:${font_size}pt;'>年齢を入力してください</span>`,
        columns: 3,
        required: true,
        name: 'age'
      }
    ],
    button_label: '次へ',
    on_finish: function (data) {
      par_info.age = data.response.age
    }
  }

  var gender = {
    type: jsPsychSurveyMultiChoice,
    questions: [
      {
        prompt: `<span style='font-size:${font_size}pt;'>性別を選択してください</span>`,
        options: [`男性`, `女性`, `その他`, `答えたくない`],
        required: true,
        horizontal: true,
        name: 'gender'
      },
    ],
    button_label: '次へ',
    on_finish: function (data) {
      par_info.gender = data.response.gender
    }
  };

  /* define instructions trial */
  var instruction = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <p>本実験では、以下のように、4つの属性で構成されている選択肢が3つ表示されます。</p>
    <p>以下の中から、あなたが最も行きたいと思う祭りの選択肢を1つ選んでください。</p>
    <p>※＜祭りに求めるもの＞　一般的（定番がそろっている）、独創的（そこでしか見れないものがある）</p>
    <p>※＜祭りの規模＞　小規模（町内）、中規模（市内）、大規模（県内）</p>
    <p>選択肢1であればキーボードのAを、選択肢2であればキーボードのJを、選択肢3であればキーボードのLを押してください。
    <p>なお、以下に示されている属性以外はすべて同じであるとお考えください。</p>

   <table>
        <tr><th></th><th>選択肢1</th> <th>選択肢2</th> <th>選択肢3</th></tr>
        <tr><td>時間帯</td><td>2</td><td>4</td><td>5</td></tr>
        <tr><td>祭りに何を求めるか</td><td>auto</td><td>manual</td><td>auto</td></tr>
        <tr><td>出店の数（店舗）</td><td>yes</td><td>no</td><td>no</td></tr>
        <tr><td>祭りの規模</td><td>35</td><td>40</td><td>30</td></tr>
        <tr><td>選択</td><td>A</td><td>J</td><td>L</td></tr>
      </table> 
    <p>スペースキーを押すと、実験が始まります。</p>
    <p>準備ができたら、スペースキーを押して、始めてください。</p>
    `,
    choices: ` `,
    post_trial_gap: 2000
  };

  var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<div style="font-size:${stim_size}px;">+</div>`,
    choices: "NO_KEYS",
    trial_duration: 1000
  };

  // Creat a table
  var stimuli_table = [];
  for (var i = 0; i < N_CHOICE; i++) {
    var att = Object.keys(test_stimuli[0]);
    var x10 = test_stimuli[randoms[i][0]].時間帯;
    var x11 = test_stimuli[randoms[i][0]].祭りに求めるもの;
    var x12 = test_stimuli[randoms[i][0]].出店の数;
    var x13 = test_stimuli[randoms[i][0]].祭りの規模;
    var x20 = test_stimuli[randoms[i][1]].時間帯;
    var x21 = test_stimuli[randoms[i][1]].祭りに求めるもの;
    var x22 = test_stimuli[randoms[i][1]].出店の数;
    var x23 = test_stimuli[randoms[i][1]].祭りの数;
    var x30 = test_stimuli[randoms[i][2]].時間帯;
    var x31 = test_stimuli[randoms[i][2]].祭りに求めるもの;
    var x32 = test_stimuli[randoms[i][2]].出店の数;
    var x33 = test_stimuli[randoms[i][2]].祭りの規模;

    var sti = {
      stimulus:
        `<table>
        <tr><th></th><th>選択肢1</th> <th>選択肢2</th> <th>選択肢3</th></tr> 
        <tr><td>${att[0]}</td><td>${x10}</td><td>${x20}</td><td>${x30}</td></tr>
        <tr><td>${att[1]}</td><td>${x11}</td><td>${x21}</td><td>${x31}</td></tr>
        <tr><td>${att[2]}</td><td>${x12}</td><td>${x22}</td><td>${x32}</td></tr>
        <tr><td>${att[3]}</td><td>${x13}</td><td>${x23}</td><td>${x33}</td></tr>
        <tr><td>選択</td><td>A</td><td>J</td><td>L</td></tr>
      </table>
      `};
    stimuli_table.push(sti);
  }

  var test = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: jsPsych.timelineVariable('stimulus'),
    choices: ['a', 'j', 'l'],
    data: { task: 'response' },
  }

  var trials = {
    timeline: [fixation, test],
    timeline_variables: stimuli_table,
    repetitions: 1,
    randomize_order: false
  }

  /* define debrief */
  var debrief = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>これで実験は終了です。<br>ありがとうございました。</p>
    <p>スペースキーを押すと記録がダウンロードされます。</p>
    <p>ダウンロードされたのを確認してから、ブラウザを閉じて、実験プログラムは終了してください。</p>
    <p>ご協力ありがとうございました。</p> `,
    choices: ` `,
  };

  // Create a timiline
  var timeline = [];
  timeline.push(welcome);
  timeline.push(id);
  timeline.push(age);
  timeline.push(gender);
  timeline.push(instruction);
  timeline.push(trials);
  timeline.push(debrief);

  /* start the experiment */
  jsPsych.run(timeline);
</script>

</html>
