INSERT INTO continents VALUES
  (1, 'Asia'),
  (2, 'Europe'),
  (3, 'Africa'),
  (4, 'Oceania'),
  (6, 'South America');

INSERT INTO driving_sides VALUES
  (1, 'right'),
  (2, 'left');

INSERT INTO regions VALUES
  (1, 'Asia'),
  (2, 'Europe'),
  (3, 'Africa'),
  (4, 'Oceania'),
  (5, 'Americas');

INSERT INTO subregions VALUES
  (11, 'Northern Africa'),
  (13, 'Western Europe'),
  (14, 'South America'),
  (18, 'Northern Europe'),
  (21, 'Eastern Asia'),
  (23, 'Southern Asia'),
  (24, 'Australia and New Zealand');

-- Values are copied from dev db, and as such the id's are seemingly random.

INSERT INTO countries VALUES
  (13, 1002450, 'EGY', 1, false, 'Egypt', 102334403, 3, 11, 27, 30, 'Cairo'),
  (55, 323802, 'NOR', 1, false, 'Norway', 5379475, 2, 18, 62, 10, 'Oslo'),
  (97, 338424, 'FIN', 1, false, 'Finland', 5530719, 2, 18, 64, 26, 'Helsinki'),
  (139, 41284, 'CHE', 1, true, 'Switzerland', 8654622, 2, 13, 47, 8, 'Bern'),
  (160, 450295, 'SWE', 1, false, 'Sweden', 10353442, 2, 18, 62, 15, 'Stockholm'),
  (173, 9706961, 'CHN', 1, false, 'China', 1402112000, 1, 21, 35, 105, 'Beijing'),
  (188, 270467, 'NZL', 2, false, 'New Zealand', 5084300, 4, 24, -41, 174, 'Wellington'),
  (190, 3287590, 'IND', 2, false, 'India', 1380004385, 1, 23, 20, 77, 'New Delhi'),
  (194, 8515767, 'BRA', 1, false, 'Brazil', 212559409, 5, 14, -10, -55, 'Brasília');

INSERT INTO country_continents VALUES
  (13, 3),
  (55, 2),
  (97, 2),
  (139, 2),
  (160, 2),
  (173, 1),
  (188, 4),
  (190, 1),
  (194, 6);

INSERT INTO languages VALUES
  (4, 'English'),
  (5, 'Arabic'),
  (11, 'French'),
  (19, 'Portuguese'),
  (36, 'Italian'),
  (51, 'Norwegian Nynorsk'),
  (52, 'Norwegian Bokmål'),
  (53, 'Sami'),
  (70, 'Chinese'),
  (72, 'Tamil'),
  (83, 'Finnish'),
  (84, 'Swedish'),
  (107, 'Swiss German'),
  (108, 'Romansh'),
  (136, 'Māori'),
  (137, 'New Zealand Sign Language'),
  (138, 'Hindi');

INSERT INTO country_languages VALUES
  (13, 5),
  (55, 51),
  (55, 52),
  (55, 53),
  (97, 83),
  (97, 84),
  (139, 11),
  (139, 36),
  (139, 107),
  (139, 108),
  (160, 84),
  (173, 70),
  (188, 4),
  (188, 136),
  (188, 137),
  (190, 4),
  (190, 72),
  (190, 138),
  (194, 19);

INSERT INTO country_neighbours VALUES
  (55, 97),
  (55, 160),
  (97, 55),
  (97, 160),
  (160, 55),
  (160, 97),
  (173, 190),
  (190, 173);
