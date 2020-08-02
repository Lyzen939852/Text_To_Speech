// 第一步 初始化 speechsynthesis API
const synth = window.speechSynthesis;

// 第二步 获取DOM节点
//querySelector() 方法返回文档中匹配指定 CSS 选择器的一个元素
const body = document.querySelector("body");
const textForm = document.querySelector("form");
const textInput = document.querySelector("#text-input");
const voiceSelect = document.querySelector("#voice-select");
const rate = document.querySelector("#rate");
const rateValue = document.querySelector("#rate-value");
const pitch = document.querySelector("#pitch");
const pitchValue = document.querySelector("#pitch-value");

// 第三步 创建voices arry 并获得下拉框语音选项(ES6语法)
let voices = [];

//箭头函数：()=>{}   function(){}

const getVoices = () => {
  voices = synth.getVoices();  //获取所有语音并赋值给voices
  //synth.getVoices(); 是异步方法，为了解决这个问题，使用onvoiceschanged
  // console.log(voices);

  // 循环voices数组 并创建option节点插入语音
  voices.forEach(voice => {
    // 创建option标签
    const option = document.createElement("option");
    // 插入语音名称及语音编码
    option.textContent = voice.name + "(" + voice.lang + ")";
    // 设置option的属性
    option.setAttribute("data-lang", voice.lang);
    option.setAttribute("data-name", voice.name);
    //在select元素中创建option元素
    voiceSelect.appendChild(option);
  });
};

getVoices();
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// 第四步 speak
const speak = () => {
  // 验证是否在说话
  if (synth.speaking) {
    console.error("正在说话中...");
    return;
  }

  if (textInput.value !== "") {
    // 添加背景动画（gif）
    body.style.background = "#141414 url(img/wave.gif)";
    body.style.backgroundRepeat = "repeat-x";
    body.style.backgroundSize = "100% 100%";
    body.style.backgroundPositionY = "-80px";
    // 获得说话文本
    const speakText = new SpeechSynthesisUtterance(textInput.value);

    // 说话结束触发
    //e =>{}  function(event){}
    speakText.onend = e => {
      console.log("说话结束");
      body.style.background = "#141414";
    };

    // 发生阻止说出话语的错误就触发
    speakText.onerror = e => {
      console.error("抱歉出错了");
    };

    // 选择下拉框中的语音（选中的语音和遍历出来的语音是同一个，就需要发声）
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      "data-name"
    );

    // 遍历voices
    //进行判断，然后让文本发生
    //voice就是voices数组中的每一项
    voices.forEach(voice => {
      if (voice.name === selectedVoice) {
        speakText.voice = voice;
      }
    });

    // 设置音速和音调
    speakText.rate = rate.value;
    speakText.pitch = pitch.value;

    // speak是synth里面的方法，speakText:说话的文本（包括选择哪种语言、音速、音调）
    synth.speak(speakText);
  }
};

// 事件监听

// form表单文本提交
textForm.addEventListener("submit", e => {
  e.preventDefault();//阻止表单默认事件
  speak();//调用说话函数
  textInput.blur();//失去焦点,失去焦点后，有刷新提醒功能
});

// 音速值的变化：change事件
rate.addEventListener("change", e => (rateValue.textContent = rate.value));

// 音调值的变化
pitch.addEventListener("change", e => (pitchValue.textContent = pitch.value));

// 下拉框选项切换
voiceSelect.addEventListener("change", e => speak());

// https://www.jianshu.com/p/0fe532e959f9
