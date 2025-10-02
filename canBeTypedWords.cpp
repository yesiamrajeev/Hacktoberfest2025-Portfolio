#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    int canBeTypedWords(string text, string brokenLetters) {
        unordered_set<char> broken(brokenLetters.begin(), brokenLetters.end());
        int count = 0;
        istringstream iss(text); // split text into words
        string word;

        while (iss >> word) {
            bool ok = true;
            for (char c : word) {
                if (broken.count(c)) { 
                    ok = false; 
                    break; 
                }
            }
            if (ok) ++count;
        }
        return count;
    }
};

int main() {
    Solution sol;

    string text1 = "hello world";
    string broken1 = "ad";
    cout << "Input: \"" << text1 << "\", broken: \"" << broken1 << "\"\n";
    cout << "Output: " << sol.canBeTypedWords(text1, broken1) << "\n\n"; 
    // Expected: 1 ("world" can be typed, "hello" cannot because 'h' is broken)

    string text2 = "leet code";
    string broken2 = "lt";
    cout << "Input: \"" << text2 << "\", broken: \"" << broken2 << "\"\n";
    cout << "Output: " << sol.canBeTypedWords(text2, broken2) << "\n\n"; 
    // Expected: 1 ("code" can be typed, "leet" cannot)

    string text3 = "leet code";
    string broken3 = "e";
    cout << "Input: \"" << text3 << "\", broken: \"" << broken3 << "\"\n";
    cout << "Output: " << sol.canBeTypedWords(text3, broken3) << "\n"; 
    // Expected: 0 (both words contain 'e')

    return 0;
}
