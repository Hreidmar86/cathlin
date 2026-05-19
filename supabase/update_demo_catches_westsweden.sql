-- Uppdaterar befintliga demo-rader i public.catches till mer trovärdiga
-- Västsverige-platser runt Sjuntorp, Trollhättan, Göta älv, Vänern och närliggande vatten.
--
-- Körs i Supabase SQL Editor efter att demo-rader redan finns i tabellen.
-- Matchning sker på nuvarande demo-identitet:
-- angler + species + date + trip_name

with mapped_rows as (
  select *
  from (
    values
      (
        'Robin',
        'Gädda',
        date '2026-05-12',
        'Kvällspass bland vassarna',
        'Göta älv, Sjuntorp',
        'Kvällspass i älvvassen',
        'Mulet, lätt sydvästlig vind',
        'Firetiger jerkbait 14 cm',
        'Stod och nötte längs vassen en bra stund innan det small till ordentligt. Kändes som att den bara dök upp från ingenstans på sista kastet där sträckan.',
        'Fokus',
        array['älv', 'kväll', 'vass']
      ),
      (
        'Cathlin',
        'Abborre',
        date '2026-04-28',
        'Morgon på djupkanten',
        'Öresjö, Trollhättan',
        'Morgon vid djupkanten i Öresjö',
        'Klart, kylig morgon',
        'Mörk shad 8 cm på dropshot',
        'Första riktiga kontakten kom nästan direkt när betet stannade upp. Sen blev det helt lugnt igen, så den här fisken kändes extra skön.',
        'Skärpt',
        array['öresjö', 'morgon', 'abborre']
      ),
      (
        'Båda',
        'Gös',
        date '2026-03-18',
        'Sakta drift över djupet',
        'Vänern, Gaddesanna',
        'Sakta drift över djupet',
        'Dis, nästan vindstilla',
        'Pearl jigg 12 cm',
        'Vi drev långsamt över kanten och pratade knappt alls när den tog. Bara ett sånt där tungt sug i spöt som direkt känns som gös.',
        'Metodisk',
        array['vänern', 'vertikal', 'gös']
      ),
      (
        'Cathlin',
        'Öring',
        date '2026-02-23',
        'Vinterluft vid udden',
        'Vänern, Sikhall',
        'Vinterluft vid Sikhall',
        'Klar luft, frisk vind',
        'Silver/orange genomlöpare 24 g',
        'Det var kallt om fingrarna och ganska segt länge, men den här kom efter ett kast där allt bara satt rätt. Riktigt fin fisk för platsen.',
        'Lugn',
        array['vänern', 'öring', 'vinter']
      ),
      (
        'Robin',
        'Gädda',
        date '2026-01-14',
        'Seg vinterdag',
        'Hullsjön',
        'Seg vinterdag i Hullsjön',
        'Låg sol, kallt vatten',
        'Softbait 18 cm',
        'Hela passet kändes trögt och kallt, så den här räddade dagen fullständigt. Tog nära dött gräs där man nästan tappat tron på platsen.',
        'Tålmodig',
        array['hullsjön', 'gädda', 'vinter']
      ),
      (
        'Båda',
        'Abborre',
        date '2026-05-02',
        'Lunchpass på stenbanken',
        'Slumpån',
        'Lunchpass i Slumpån',
        'Solglimtar, ryckig vind',
        'Motor oil-jigg 7 cm',
        'Det var ganska dött först och vi funderade nästan på att dra vidare. Sen hittade vi ett litet område där det stod fisk och då lossnade det snabbt.',
        'Lättad',
        array['slumpån', 'lunch', 'stim']
      )
  ) as t(
    old_angler,
    old_species,
    old_date,
    old_trip_name,
    new_location,
    new_trip_name,
    new_weather,
    new_lure,
    new_note,
    new_mood,
    new_tags
  )
)
update public.catches as c
set
  location = m.new_location,
  trip_name = m.new_trip_name,
  weather = m.new_weather,
  lure = m.new_lure,
  note = m.new_note,
  mood = m.new_mood,
  tags = m.new_tags,
  updated_at = now()
from mapped_rows as m
where c.angler = m.old_angler
  and c.species = m.old_species
  and c.date = m.old_date
  and c.trip_name = m.old_trip_name;
