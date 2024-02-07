import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardEntity } from './entities/card.entity';
import { CreateYapilanlarDto } from 'src/yapilanlar/dto/create-yapilanlar.dto';

function parseAndValidateDate(dateString) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new BadRequestException('Geçersiz tarih formatı');
  }
  return date;
}

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) { }

  @Post()
  async create(@Body() createCardDto: CreateCardDto) { // if nullsa gelecek
    try {
      let yapilanlar = createCardDto.yapilanlar;
      yapilanlar.forEach(async element => {
        console.log(element);
        element.birimAdedi = parseInt(element.birimAdedi.toString());
        element.birimFiyati = parseInt(element.birimFiyati.toString());
        element.toplamFiyat = parseInt(element.toplamFiyat.toString());
      });
      createCardDto.yapilanlar = yapilanlar;

      createCardDto.km = parseInt(createCardDto.km.toString());
      createCardDto.modelYili = parseInt(createCardDto.modelYili.toString());
      // date formatı kontrolü
      try {
        createCardDto.girisTarihi = parseAndValidateDate(createCardDto.girisTarihi);
      } catch (error) {
        throw new BadRequestException('girisTarihi için geçersiz tarih formatı');
      }

    } catch (error) {
      return error;
    }
    return this.cardService.create(createCardDto);
  }

  @Get(':card_id/yapilanlar')
  findYapilanlarByCardId(@Param('card_id') card_id: number) {
    return this.cardService.findYapilanlarByCardId(card_id);
  }

  @Get()
  findAll() {
    return this.cardService.findAll();
  }

  @Post('update-card/:card_id')
  updateCardYapilanlar(@Body() updateYapilan: CreateYapilanlarDto, @Param('card_id') card_id: number) {
    return this.cardService.updateCardYapilanlar(updateYapilan, +card_id);
  }


  // @Get(':id') // Bu yol, ID'ye göre tek bir kart bulmak için kullanılır.
  // findOne(@Param('id') id: string) {
  //   console.log(id);
  //   console.log(parseInt(id, 10))
  //   return this.cardService.findOne(parseInt(id, 10));
  // }

  @Patch(':card_id')
  update(@Param('card_id') card_id: string, @Body() updateCardDto: CardEntity) {
    return this.cardService.update(parseInt(card_id, 10), updateCardDto);
  }

  @Delete("delAll")
  removeAll() {
    return this.cardService.removeAll();
  }

  @Delete(':card_id')
  remove(@Param('card_id') card_id: string) {
    return this.cardService.removeid(parseInt(card_id, 10));
  }
}
