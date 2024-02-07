import { YapilanlarEntity } from '../../yapilanlar/entities/yapilanlar.entity';

import { Entity, Column, PrimaryGeneratedColumn,OneToMany } from 'typeorm';

@Entity()
export class TeklifEntity {
    @PrimaryGeneratedColumn()
    teklif_id: number;

    @Column({ nullable: true })
    adSoyad: string;

    @Column({ nullable: true })
    telNo: string;

    @Column({ nullable: true })
    markaModel: string;

    @Column({ nullable: true })
    plaka: string;
    
    @Column({ nullable: true })
    km: number;

    @Column({ nullable: true })
    modelYili: number;

    @Column({ nullable: true })
    sasi: string;

    @Column({ nullable: true })
    renk: string;

    @Column({ nullable: true })
    girisTarihi: Date;

    @Column({ nullable: true })
    notlar: string;

    @Column({ nullable: true })
    adres: string;

    @OneToMany(() => YapilanlarEntity, yapilan => yapilan.teklif)
    yapilanlar: YapilanlarEntity[];
}
