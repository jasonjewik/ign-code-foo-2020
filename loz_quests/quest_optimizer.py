import argparse
import pandas as pd
import os

def optimize_quest_list(df, remaining_quests):
    solution = list()

    # Recursion exit condition
    if len(remaining_quests) == 0:
        return remaining_quests, solution

    # Step 1: Adjust the rewards of the remaining quests
    adjusted_rwds = dict()
    
    for i in range(len(remaining_quests) - 1, -1, -1):
        cur_row = remaining_quests[i]
        assert cur_row in df.index, "Invalid current row index!"

        cur_date = df.at[cur_row, 'start_date']
        cur_duration = df.at[cur_row, 'duration']
        assert cur_date > 0 and cur_duration > 0, "Invalid date and/or duration!"

        cur_rwd = df.at[cur_row, 'reward']

        for j in range(i + 1, len(remaining_quests)):
            row = remaining_quests[j]
            assert row in df.index, "Invalid row index!"

            date = df.at[row, 'start_date']                

            if date >= cur_date + cur_duration:
                break
            elif date > cur_date and date < cur_date + cur_duration:
                cur_rwd -= df.at[row, 'reward']

        if cur_rwd >= 0:
            adjusted_rwds[cur_row] = cur_rwd

    # Step 2: Pick the quests with positive adjusted cost, highest to lowest,
    # and remove the invalidated quests.
    adjusted_rwds = {
        k: v for k, v in sorted(adjusted_rwds.items(), 
        key=lambda item : item[1], reverse=True)
    }
    
    for key in adjusted_rwds.keys():
        if key in remaining_quests:
            solution.append(key)              

            # Removes quests which start before and end after the
            # start of the selected quest
            lst_idx = 0
            selected_quest_start = df.at[key, 'start_date']

            while lst_idx < len(remaining_quests):
                row_idx = remaining_quests[lst_idx]
                start = df.at[row_idx, 'start_date']
                end = start + df.at[row_idx, 'duration']                    

                if start > selected_quest_start:
                    break
                elif selected_quest_start < end:
                    remaining_quests.pop(lst_idx)
                else:
                    lst_idx += 1

            # Removes quests which start at the same time as or after the
            # start and before the end of the selected quest
            selected_quest_end = selected_quest_start + df.at[key, 'duration']

            while lst_idx < len(remaining_quests):
                row_idx = remaining_quests[lst_idx]
                start = df.at[row_idx, 'start_date']

                if start >= selected_quest_end:
                    break
                elif start >= selected_quest_start:
                    remaining_quests.pop(lst_idx)
                else:
                    lst_idx += 1

    solution.sort()

    # Step 3: Fill the remaining intervals 
    for quest in solution:
        if len(remaining_quests) == 0:
            break

        can_only_fit_one = True
        i = 0
        cur_quest = remaining_quests[i]        
        cur_end = df.at[cur_quest, 'start_date'] + df.at[cur_quest, 'duration']
        interval = dict()        

        while cur_quest < quest:
            interval[cur_quest] = df.at[cur_quest, 'reward']
            j = i
            other_quest = remaining_quests[j]
            
            while other_quest < quest:
                if df.at[other_quest, 'start_date'] > cur_end:
                    can_only_fit_one = False
                    break
                
                j += 1
                if j >= len(remaining_quests):
                    break
                other_quest = remaining_quests[j]

            i += 1
            if i >= len(remaining_quests):
                break
            cur_quest = remaining_quests[i]

        # Step 3a: Pick the quest with the highest reward if only one can be
        # fit in this interval
        if can_only_fit_one and len(interval.keys()):
            solution.append(max(interval, key=lambda i: interval[i]))

            for key in interval.keys():
                remaining_quests.pop(remaining_quests.index(key))

        # Step 3b: If more than one quest can be fit in this interval, then
        # repeat this process for the interval
        else:
            inner_remaining_quests, inner_solution = \
                optimize_quest_list(df, list(interval.keys()))

            removed_quests = list(set(interval.keys()) - set(inner_remaining_quests))

            for rm_quest in removed_quests:
                remaining_quests.pop(remaining_quests.index(rm_quest))

            solution.extend(inner_solution)

    return remaining_quests, solution

def main():
    # Get the filepath from CLI arguments
    parser = argparse.ArgumentParser(description='Determines the quests \
        Link should take to earn the max amount of rupees in a month.')
    parser.add_argument('-f', '--filepath', required=True, 
        help='The path of the CSV file that contains quest information.')
    args = parser.parse_args()

    # Read the data from the given CSV file
    assert os.path.isfile(args.filepath), 'Data file does not exist!'

    df = pd.read_csv(args.filepath, header=0, 
        names=['quest','start_date','duration','reward'],usecols=[0,1,2,3])
    assert df.size > 0, "No quests found!"

    # Sort the quests by start date
    df.sort_values(by='start_date', inplace=True, ignore_index=True)
    
    # Get the optimized quest list
    remaining_quests = list(df.index)
    remaining_quests, solution = optimize_quest_list(df, remaining_quests)
    solution.sort()

    # Display the results
    print('Quest List:')
    total_reward = 0

    for idx, quest in enumerate(solution):
        print(f'\t{idx + 1}. {df.at[quest, "quest"]}')
        total_reward += df.at[quest, 'reward']

    print(f'Total Reward: {total_reward}')

main()