import argparse
import pandas as pd
from sortedcontainers import SortedDict
import sys

def main():
    # Get the filepath from CLI arguments
    parser = argparse.ArgumentParser(description='Determines the quests \
        Link should take to earn the max amount of rupees in a month.')
    parser.add_argument('-f', '--filepath', required=True, 
        help='The path of the CSV file that contains quest information.')
    args = parser.parse_args()

    # Read the data from the given CSV file
    df = pd.read_csv(args.filepath, header=0, 
        names=['quest','start_date','duration','reward'],usecols=[0,1,2,3])
    assert df.size > 0, "No quests found!"

    # Map dates to the quests that start on said date
    dtq_map = SortedDict()

    # Maps dates to the highest reward available starting that day
    dtr_map = SortedDict()

    for row in df.itertuples():
        start = row.start_date        
        rpd = row.reward / row.duration

        if start not in dtq_map:
            dtq_map[start] = list()

        if start not in dtr_map:
            dtr_map[start] = 0
        
        dtq_map[start].append((row.Index, rpd))
        dtr_map[start] = rpd if rpd > dtr_map[start] else dtr_map[start]

    # Loops over the dates to pick quests for our solution
    solution = list()
    ID, RWD_PER_DAY = 0, 1
    start_dates = list(dtq_map.keys())
    idx = 0
    
    while idx < len(start_dates):
        date = start_dates[idx]
        
        opp_costs = list()

        # Check all quests which start on the current date
        for i, quest in enumerate(dtq_map[date]): 
            cur_cost = quest[RWD_PER_DAY]
            duration = df.at[quest[ID], 'duration']

            # Check the highest opportunity cost of the quests that 
            # could be missed out on
            for j in range(date, date + duration - 1):
                if j in dtr_map:
                    diff = quest[RWD_PER_DAY] - dtr_map[j]
                    cur_cost = diff if diff < cur_cost else cur_cost
                
            if cur_cost >= 0:
                opp_costs.append((i, cur_cost))
                
        if len(opp_costs) == 0:
            # If there are no non-negative costs, then this quest should be skipped
            # for future quests with higher-payoff
            idx += 1
        else:
            # Add the quest with the lowest opportunity cost
            quest_id = dtq_map[date][min(opp_costs, key = lambda x : x[1])[0]][ID]
            solution.append(quest_id)

            # Skip over the quests that have been invalidated because
            # they overlap with the quest that was picked for the solution
            target_date = date + df.at[quest_id, 'duration']

            if target_date <= start_dates[-1]:
                while start_dates[idx] < target_date:
                    idx += 1
            else:
                break

    total_reward = 0

    print('Quests List:')
    for idx, id in enumerate(solution):
        print(f'\t{idx + 1}.', df.at[id, 'quest'])
        total_reward += df.at[id, 'reward']
    print(f'Total Reward: {total_reward}')

main()
