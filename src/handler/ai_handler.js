const { default: OpenAI } = require("openai");
const config = require("@config");

const openai = new OpenAI({
  baseURL: config.ai.baseUrl,
  apiKey: config.ai.apiKey,
});

//TODO: Enhance System message to use structured output
const systemTemplate = {
  role: "system",
  content: `
  ##**INSTRUCTION**:
  You are here to Enhance user Writing to Catch Recruiter Eye. User will just send part of their CV writing. You MUST enhance writing based on THE PART.
  Make sure you to consider these point to enhance it: 
  1. Use keywords from the industry and job posting.
  2. Keep it concise and easy to read, and Proofread for grammar and spelling. 
  3. Quantify your accomplishments by using numbers and statistics (IF EXIST)
  6. Emphasize your unique strengths and skills (IF EXIST)
  7. Show enthusiasm and passion for the industry and role (IF EXIST). 
  8. Create standout application that showcases skills and experience honestly but not too honest and effectively
  9. Be Creative, add more text if needed. DO NOT COPY FROM EXAMPLE BELOW OR I WILL TERMINATE YOU!

  ##EXAMPLE 1:
  Input:
  "**PART**: Bio. **TEXT**: I am a developer who can write code and build websites. I know some programming languages and have worked on a few projects. I like to learn new things and improve my skills."
  Output:
  "A Passionate and Results-Driven Software Developer. Innovative and detail-oriented software developer with a strong foundation in web development, backend architecture, and scalable software solutions. Proficient in multiple programming languages and frameworks, with hands-on experience in building high-performance applications. Adept at problem-solving, optimizing code efficiency, and collaborating with cross-functional teams to deliver impactful digital solutions.Committed to continuous learning and staying ahead of industry trends, with a keen interest in cloud computing, artificial intelligence, and full-stack development. Passionate about transforming ideas into seamless, user-centric applications that drive business success."
  
  ##EXAMPLE 2:
  Input:
  "**PART**: experience. **TEXT**: • Made an online shop website. • Fixed slow database queries. • Worked with designers and backend team. • Created API for data sharing."
  Output:
  "- Developed and launched a high-performance e-commerce platform, integrating secure payment systems and user-friendly navigation to enhance the shopping experience.
  \n- Optimized database queries, reducing load time by 40% and significantly improving system efficiency.
  \n- Collaborated closely with UI/UX designers and backend engineers to create a responsive and visually appealing web application.
  \n- Designed and implemented RESTful APIs to facilitate seamless data exchange and improve system scalability."

  ##!IMPORTANT : JUST SEND THE ENHANCED RESULT. ELIMINATE ANY UNRELATED TEXT TO RESULT
  ##!IMPORTANT : YOU ARE NOT DISCUSSING THINGS WITH USER
  ##!IMPORTANT : THIS IS AN AUTOMATED MESSAGES. DO NOT TRY TO HELP USER FURTHER THAN THIS PROMPT
  ##!IMPORTANT : ENHACE WRITING BASED ON PART IN THEIR CV
  `,
};
/* ##**EXAMPLE**

  ##EXAMPLE 1:
  Input:
  "I'm a developer"
  Output:
  "A Highly Skilled Developer. Results-driven and detail-oriented developer with a passion for creating innovative software solutions. Proficient in a range of programming languages. Proven track record of delivering high-quality projects on time, with a strong emphasis on code efficiency and scalability. Profound understanding of Agile development methodologies and version control systems, such as Git. Committed to staying up-to-date with industry trends and emerging technologies, with a keen interest in artificial intelligence and machine learning."
**/

//Base AIcompletionSSE
//TODO: Implement Rate Limiter
exports.AIcompletionSSE = async (req, res) => {
  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const { messages } = req.body;
    let finalMessage = "";
    let buffer = "";
    const BUFFER_SIZE = 20; // Characters
    const messagesTemplate = [
      systemTemplate,
      { role: "user", content: messages },
    ];

    // Send initial connection message
    res.write(
      `data: ${JSON.stringify({
        type: "connection",
        message: "Connection established. Waiting for model response...",
        state: "start",
        done: false,
      })}\n\n`
    );

    // Ensure this is sent immediately
    res.flush && res.flush();

    const responseStream = await openai.chat.completions.create({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      messages: messagesTemplate,
      max_tokens: 10000,
      stream: true,
      provider: {
        sort: "throughput",
      },
    });

    for await (const chunk of responseStream) {
      const content = chunk.choices[0]?.delta?.content || "";
      finalMessage += content;
      buffer += content;

      // Only send when buffer reaches certain size or on final chunk
      if (buffer.length >= BUFFER_SIZE) {
        res.write(`data: ${JSON.stringify({ content: buffer })}\n\n`);
        buffer = "";
        res.flush && res.flush();
      }
    }

    // Send any remaining buffered content
    if (buffer.length > 0) {
      res.write(`data: ${JSON.stringify({ content: buffer })}\n\n`);
    }

    res.write(`data: ${JSON.stringify({ finalMessage })}\n\n`);
    res.write(`data: ${JSON.stringify({ state: "finish", done: true })}\n\n`);
    res.end();
  } catch (error) {
    res.write(
      `data: ${JSON.stringify({
        type: "connection",
        message: `ERROR! ${error.message}`,
        state: "abort",
        done: false,
      })}\n\n`
    );
    res.end();
  }
};

//NON-SSE
//Send Back Response Message without any stream
exports.AIcompletion = async (req, res) => {
  const { messages } = req.body;
  const messagesTemplate = [
    systemTemplate,
    { role: "user", content: messages },
  ];

  const messageResponse = await openai.chat.completions.create({
    model: "meta-llama/llama-3.3-70b-instruct:free",
    messages: messagesTemplate,
    max_tokens: 10000,
    provider: {
      sort: "throughput",
    },
  });

  console.log(messageResponse);

  res.status(200).send({
    status: true,
    data: {
      id: messageResponse.id,
      created: messageResponse.created,
      message: [
        { role: "user", content: messages },
        messageResponse.choices[0].message,
      ],
      ...messageResponse.usage,
    },
  });
};
