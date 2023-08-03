# -*- coding: utf-8 -*-
"""
Created on Tue Apr 11 16:22:49 2023

@author: abhis
"""
import os
import flask
from flask import request, jsonify
from pydub import AudioSegment
import librosa
import soundfile as sf
import matplotlib.pyplot as plt
from PIL import Image
import tensorflow as tf
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from p2fa import align #Need to access P2FA Folder
import wave
import pickle
import scipy.io
import covarep_rostermd

import torch
from torch.utils.data import (DataLoader, RandomSampler, SequentialSampler, TensorDataset)
from pytorch_pretrained_bert.file_utils import PYTORCH_PRETRAINED_BERT_CACHE,cached_path
from model import BertForSequenceClassification, BertConfig, WEIGHTS_NAME, CONFIG_NAME
from pytorch_pretrained_bert.tokenization import BertTokenizer
from utils import *
from tqdm import tqdm
#import matlab.engine
import matlab

#Change Locations for AWS
spectral_component = flask.Flask(__name__)
spectral_component.config["DEBUG"] = True
pad_ms = 5000
save_path = 'C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/spectral_sample.wav'
spectrogram_path = 'C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/spectral_sample.png'
spectral_model_path = 'C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/roster.h5'
transcript_path = 'C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/roster_sample.txt'
alignments_path = 'C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/alignment.npy'
covarep_path = 'C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/roster_sample.mat'
normalized_audio_features_path = 'D:/text_audio/sample.npy'


data_dir='D:/text_audio/Cross-Modal-BERT-master/data/text'
bert_model='D:/text_audio/Cross-Modal-BERT-master/pre-trained BERT'
output_dir='D:/text_audio/Cross-Modal-BERT-master/CM-BERT_output'
max_seq_length=50
do_lower_case= True
test_batch_size= 24


@spectral_component.route('/audio', methods=['POST'])
def get_prediction():
    if (request.method == 'POST'):
        request.files['clip'].save(save_path)
        y, sr = librosa.load(save_path, sr=16000)
        sf.write(save_path, y, sr)
        audio = AudioSegment.from_wav(save_path)
        silence = AudioSegment.silent(duration=pad_ms-len(audio)+1)
        padded=audio
        if (pad_ms > len(audio)):
            #Audio was less that 5s
            padded = padded + silence  
        padded.export(save_path, format='wav')
        
        x , sr = librosa.load(save_path, sr=22050)
        X = librosa.stft(x)
        Xdb = librosa.amplitude_to_db(abs(X))
        plt.figure(figsize=(14, 5))
        librosa.display.specshow(Xdb, sr=sr, x_axis='time', y_axis='hz')
        plt.colorbar()
        plt.savefig(spectrogram_path)
        img = load_img(spectrogram_path, target_size=(360, 1008))
        model = tf.keras.models.load_model(spectral_model_path)
        
        img_array = img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = img_array.astype('float32') / 255.0
        temp= model.predict(img_array)
        temp=temp[0]
        #Classes=['Amused', 'Angry', 'Disgusted', 'Neutral', 'Sleepy']
        #Final Score (Model B)
        output = temp[-1]*0.80+temp[1]*0.1+temp[2]*0.1
        
        '''
        #Run and Save Transcription Job in AWS
                
        #Word Alignments
        phoneme_alignments, word_alignments = align.align(save_path, transcript_path)
        np.save(alignments_path, word_alignments)
        
        #Generate COVAREP .mat file       
        
        
        eng = matlab.engine.start_matlab()
        eng.addpath('C:/Users/abhis/Desktop/test_acoustic/covarep-master')
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/voiceactivity")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/envelope")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/external/voicebox")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/formant")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/glottalsource")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/glottalsource/daless")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/glottalsource/glottal_models")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/misc")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/vocoder/hmpd")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/sinusoidal")
        eng.addpath("C:/Users/abhis/Desktop/test_acoustic/covarep-master/feature_extraction")
        extract= eng.extraction("C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/spectral_sample.wav")
        a = covarep_rostermd.initialize()
        extract = a.extraction('C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/spectral_sample.wav')
        mat=np.array(extract._data).reshape(extract.size[::-1]).T
        
        #mat = scipy.io.loadmat('C:/Users/abhis/Desktop/test_acoustic/p2fa_py3-master/p2fa/examples/final_output/roster_sample.mat')
        #mat=mat['features']
        
        #Extraction from COVAREP and normalization
        columns= mat[:, [1, 3, 6, 25, 60]]
        a=[]
        for x in word_alignments:
            start = float(x[1]) #P2FA VALUE FRAME 1 INCLUDED (0)
            end = float(x[2]) # P2FA VALUE FRAME 5 INCLUDED (5)
            start= round(start*100)-1
            end = round(end*100)-1
            if (x is word_alignments[-1]):
                end = len(columns)
            subset_array = columns[start:end]
            column_sums = [np.mean(col) for col in zip(*subset_array)]
            a.append(column_sums)
        b = np.pad(a, [(0, 50 - (len(a))), (0, 0)], mode='constant', constant_values=0)
        np.save(normalized_audio_features_path, b)
        
        #Use Audio Features in CM-BERT
        
        os.environ["CUDA_VISIBLE_DEVICES"]="1"
        processors = {
            "multi": PgProcessor,
        }
        
        num_labels_task = {
            "multi": 1,
        }
        
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        task_name = 'multi'
        
        processor = processors[task_name]()
        num_labels = num_labels_task[task_name]
        label_list = processor.get_labels()
        tokenizer = BertTokenizer.from_pretrained(bert_model, do_lower_case=do_lower_case)
        
        test_examples = processor.get_test_examples(data_dir)
        random=np.load(normalized_audio_features_path);
        test_audio = [random]
        test_examples = [test_examples[0]]
        
        
        test_features = convert_examples_to_features(test_examples, label_list, max_seq_length, tokenizer)
        
        all_test_audio = torch.tensor(test_audio, dtype=torch.float32,requires_grad=True)
        all_input_ids = torch.tensor([f.input_ids for f in test_features], dtype=torch.long)
        all_input_mask = torch.tensor([f.input_mask for f in test_features], dtype=torch.long)
        all_segment_ids = torch.tensor([f.segment_ids for f in test_features], dtype=torch.long)
        all_label_ids = torch.tensor([f.label_id for f in test_features], dtype=torch.float32)
        test_data = TensorDataset(all_input_ids, all_input_mask, all_segment_ids, all_label_ids,all_test_audio)
        # Run prediction for full data
        
        test_sampler = SequentialSampler(test_data)
        test_dataloader = DataLoader(test_data, sampler=test_sampler, batch_size=test_batch_size)
        model = BertForSequenceClassification.from_pretrained(bert_model, cache_dir="", num_labels = num_labels)
        model.load_state_dict(torch.load('pytorch_model.bin'))
        model.to(device)
        model.eval()
        test_loss, test_accuracy = 0, 0
        nb_test_steps, nb_test_examples = 0, 0
        predict_list = []
        truth_list = []
        text_attention_list = []
        fusion_attention_list = []
        with torch.no_grad():
            for input_ids, input_mask, segment_ids, label_ids, all_test_audio in tqdm(test_dataloader, desc="Evaluating"):
                input_ids = input_ids.to(device)
                input_mask = input_mask.to(device)
                segment_ids = segment_ids.to(device)
                label_ids = label_ids.to(device)
                all_test_audio = all_test_audio.to(device)
        
                with torch.no_grad():
                    #tmp_test_loss = model(input_ids, all_test_audio,segment_ids, input_mask, label_ids)
                    logits,text_attention,fusion_attention = model(input_ids, all_test_audio,segment_ids, input_mask)
                
                logits = logits.detach().cpu().numpy()
                label_ids = label_ids.to('cpu').numpy()
                text_attention = text_attention.cpu().numpy()
                fusion_attention = fusion_attention.cpu().numpy()
        
                for i in range(len(logits)):
                    predict_list.append(logits[i])
                    truth_list.append(label_ids[i])
                    text_attention_list.append(text_attention[i])
                    fusion_attention_list.append(fusion_attention[i])
                nb_test_examples += input_ids.size(0)
                nb_test_steps += 1
        
        predict_list = np.array(predict_list).reshape(-1)
        test_preds_a7 = np.clip(predict_list, a_min=-3., a_max=3.)
        '''
                
        return jsonify([{'model_b':output, 'model_a': "Hi"}])

spectral_component.run()
