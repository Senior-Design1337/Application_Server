from sklearn.feature_extraction.text import TfidfVectorizer


vect = TfidfVectorizer(min_df=1)

# 0 - job title 1
# 1 - company title 1
# 2 - job title 2
# 3 - company title 2

tfidf = vect.fit_transform(["I'd like an apple",
                             "An apple a day keeps the doctor away",
                             "Never compare an apple to an orange",
                             "I prefer scikit-learn to Orange"])

    
sim_array = (tfidf * tfidf.T).A
    
print(sim_array[0][2], sim_array[1][3])