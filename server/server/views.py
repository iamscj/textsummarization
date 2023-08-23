from django.http import JsonResponse
from transformers import pipeline, PegasusForConditionalGeneration, PegasusTokenizer
from transformers import T5ForConditionalGeneration, T5Tokenizer

from urllib.parse import unquote

def predict(request):
    try:
        input_text = request.GET.get('input_text')
        input_text =unquote(input_text)
        summarizer = pipeline("summarization")
        # if not input_text:
        #     return JsonResponse({"error": "Missing input_text parameter"}, status=400)

        # model_name = "google/pegasus-xsum"
        # pegasus_tokenizer = PegasusTokenizer.from_pretrained(model_name)
        # summarizer = pipeline(
        #     "summarization",
        #     model=model_name, 
        #     tokenizer=pegasus_tokenizer,
        #     framework="pt"
        # )

        # summary = summarizer(input_text, min_length=60, max_length=150)
        # ans = summary[0]["summary_text"]
        model_name = "t5-small"
        model = T5ForConditionalGeneration.from_pretrained(model_name)
        tokenizer = T5Tokenizer.from_pretrained(model_name)
        input_ids = tokenizer.encode(input_text, return_tensors="pt", max_length=512, truncation=True)
        summary_ids = model.generate(input_ids, max_length=150, num_return_sequences=1, length_penalty=1, no_repeat_ngram_size=2, early_stopping=True)

        # Decode and print the generated summary
        # summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        summary = summarizer(input_text, max_length=150)
        # print("Generated Summary:", summary)
        return JsonResponse({"output_text": summary[0]['summary_text']})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
