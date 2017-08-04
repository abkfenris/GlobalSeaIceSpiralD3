import pandas as pd

for in_name, out_name in (('N_seaice_extent_daily_v2.1.csv', 'N.csv'),
                          ('S_seaice_extent_daily_v2.1.csv', 'S.csv')):
    df = pd.read_csv(in_name)
    df = df.drop([u'    Missing', u' Source Data'], axis=1)
    df.to_csv(out_name)