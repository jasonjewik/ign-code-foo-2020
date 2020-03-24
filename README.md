# ign-code-foo-2020

### Instructions for LOZ Quests
1. Download and unzip or clone this repository.
2. Create a virtual environment with Python 3, then run `pip install -r requirements.txt` in the `loz_quests` folder.s
3. Run the program using `py quest_optimizer.py -f [FILENAME]` or `python3 quest_optimizer.py -f [FILENAME]`, depending on your OS.
	* [FILENAME] is the relative path to the CSV file to use. For example, to run this program on the sample data provided by IGN, FILENAME would be `data\quests.csv`.
4. The results will be printed to the command line.

#### Example for Windows:
```
PS E:\GitHub> git clone https://github.com/jasonjewik/ign-code-foo-2020.git Cloning into 'ign-code-foo-2020'...
remote: Enumerating objects: 21, done.
remote: Counting objects: 100% (21/21), done.
remote: Compressing objects: 100% (16/16), done.
remote: Total 21 (delta 7), reused 18 (delta 4), pack-reused 0
Unpacking objects: 100% (21/21), done.

PS E:\GitHub> cd ign-code-foo-2020\loz_quests

PS E:\GitHub\ign-code-foo-2020\loz_quests> py -m venv env

PS E:\GitHub\ign-code-foo-2020\loz_quests> env/scripts/activate

(env) PS E:\GitHub\ign-code-foo-2020\loz_quests> pip install -r requirements.txt
Collecting numpy==1.18.2 (from -r requirements.txt (line 1))
  Using cached https://files.pythonhosted.org/packages/f9/50/cd3e12bf41ac273702882610fd43bd765b8d2b99baf4295b00578fd69323/numpy-1.18.2-cp37-cp37m-win_amd64.whl
Collecting pandas==1.0.3 (from -r requirements.txt (line 2))
  Using cached https://files.pythonhosted.org/packages/69/69/c35fbbc9bec374c44e9c800e491e914a521dc3926fc6cee80d4821771295/pandas-1.0.3-cp37-cp37m-win_amd64.whl
Collecting python-dateutil==2.8.1 (from -r requirements.txt (line 3))
  Using cached https://files.pythonhosted.org/packages/d4/70/d60450c3dd48ef87586924207ae8907090de0b306af2bce5d134d78615cb/python_dateutil-2.8.1-py2.py3-none-any.whl
Collecting pytz==2019.3 (from -r requirements.txt (line 4))
  Using cached https://files.pythonhosted.org/packages/e7/f9/f0b53f88060247251bf481fa6ea62cd0d25bf1b11a87888e53ce5b7c8ad2/pytz-2019.3-py2.py3-none-any.whl
Collecting six==1.14.0 (from -r requirements.txt (line 5))
  Using cached https://files.pythonhosted.org/packages/65/eb/1f97cb97bfc2390a276969c6fae16075da282f5058082d4cb10c6c5c1dba/six-1.14.0-py2.py3-none-any.whl
Installing collected packages: numpy, pytz, six, python-dateutil, pandas
Successfully installed numpy-1.18.2 pandas-1.0.3 python-dateutil-2.8.1 pytz-2019.3 six-1.14.0

(env) PS E:\GitHub\ign-code-foo-2020\loz_quests> py .\quest_optimizer.py -f data\quests.csv
Quest List:
        1. The Weapon Connoisseur
        2. Sunken Treasure
        3. Riddles of Hyrule
        4. Rushroom Rush!
        5. Frog Catching
        6. Medicinal Molduga
        7. The Jewel Trade
        8. Slated for Upgrades
Total Reward: 5965
```
